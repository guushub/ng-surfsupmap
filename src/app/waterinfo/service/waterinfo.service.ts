import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import { environment } from 'environments/environment';

import * as L from 'leaflet';

import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { WaterinfoPoint as SurfsupMapPoint } from '../model/waterinfo-point';
import { WaterinfoParameter } from '../model/waterinfo-parameter';
import { WaterinfoGroup } from '../model/waterinfo-group';

import { SurfsupMapParameter, SurfsupMapData } from '../../surfsup-map/surfsup-map-data/model/surfsup-map-data';

//TODO: move interfaces to model
export interface WaterinfoLatestMeasurement {
    latestValue: number;
    dateTime: Date;
    unitCode: string;
    parameterId: string;
}

export interface WaterinfoProperties {
    name: string;
    measurements: WaterinfoLatestMeasurement[];
    locationCode: number;
    featured: boolean;
}

interface WaterinfoPoint extends GeoJSON.Point {
    properties: WaterinfoProperties
}

export interface WaterinfoLatest {
    parameter: WaterinfoParameter;
    features: GeoJSON.Feature<WaterinfoPoint>[];
}

@Injectable()
export class WaterinfoService {

    private groups: Observable<WaterinfoGroup[]>;
    
    constructor(private http: HttpClient) {

    }

    /* API interaction */
    getLatest(parameterIds: string): Observable<GeoJSON.FeatureCollection<WaterinfoPoint>> {
        const url = environment.proxyUrl;
        const params = encodeURIComponent(`http://waterinfo.rws.nl/api/point/latestmeasurements?parameterIds=${parameterIds}`)
        return this.http.get<GeoJSON.FeatureCollection<WaterinfoPoint>>(`${url}?${params}`)
            .catch(this.handleError);
    }

    getGroups(): Observable<WaterinfoGroup[]> {
        if(!this.groups) {
            const url = environment.proxyUrl;
            const params = encodeURIComponent("https://waterinfo.rws.nl/api/nav/allgroups");
            this.groups = this.http.get<Observable<WaterinfoGroup[]>>(`${url}?${params}`)
            .publishReplay(1) //cache
            .refCount()
            .catch(this.handleError);;
        } 
        
        return this.groups;
    }

    getLatestCombined(parameterIds: string[]): Observable<GeoJSON.FeatureCollection<WaterinfoPoint>>  {
        const url = environment.proxyUrl;
        const queryString = parameterIds.map(parameterId => `parameterIds=${parameterId}`).join("&");
        const params = encodeURIComponent(`http://waterinfo.rws.nl/api/point/latestmeasurements?${queryString}`)
        return this.http.get<GeoJSON.FeatureCollection<WaterinfoPoint>>(`${url}?${params}`)
            .catch(this.handleError);
    }

    getLatestAsSurfsupMapData(group: string, parQuantity: string, parDirection?: string, parLabel?: string): Observable<SurfsupMapPoint[]> {
        
        const getLatestObservables = [
            this.getWaterinfoLatest(parQuantity)
        ]

        if(parDirection) {
            getLatestObservables.push(
                this.getWaterinfoLatest(parDirection)
            )
        }

        if(parLabel) {
            getLatestObservables.push(
                this.getWaterinfoLatest(parLabel)
            )
        }

        return Observable.forkJoin(getLatestObservables)
            .map((results) => {
                const quantity = results[0];
                const direction = parDirection ? results[1] : null;
                const label = parLabel ? results[results.length - 1] : null;
                
                return this.waterinfoLatestToSurfMapData(group, quantity, direction, label)
                
            })
            .catch(this.handleError);

    }

    /* Transform */
    private waterinfoLatestToSurfMapData(group: string, quantityLatest: WaterinfoLatest, directionLatest: WaterinfoLatest, labelLatest: WaterinfoLatest): SurfsupMapPoint[] {
        const points: SurfsupMapPoint[] = [];
        const stationDict: { [locationCode: string]: SurfsupMapPoint } = {};

        quantityLatest.features.forEach(feature => {
            const properties = feature.properties as WaterinfoProperties;
            const quantityRecord = this.waterinfoPropertiesToSurfsupMapRecord(properties, quantityLatest.parameter);
            // TODO checks for certain values to ignore (create validation object)
            if (properties.measurements[0].latestValue > 9999) {
                return;
            }

            if (new Date().getTime() - new Date(properties.measurements[0].dateTime).getTime() > 3600000) {
                // data is older than an hour.
                return;
            }

            const point = new SurfsupMapPoint({
                    data: { quantity: quantityRecord },
                    group: group,
                    locationCode: properties.locationCode.toString(),
                    name: properties.name
                }, 
                {
                    x: feature.geometry.coordinates[0],
                    y: feature.geometry.coordinates[1]
                },
                feature.crs.properties["name"] 
            );


            stationDict[properties.locationCode] = point;

        });

        if(directionLatest && directionLatest.features) {
            directionLatest.features.forEach(feature => {
                const properties = feature.properties as WaterinfoProperties;

                if (!(properties.locationCode in stationDict)) {
                    return;
                }
                
                // TODO check for certain values to ignore (create validation object)
                if (properties.measurements[0].latestValue > 360) {
                    properties.measurements[0].latestValue = NaN;
                }

                const dataQuantity = stationDict[properties.locationCode].properties.data.quantity;
                if (new Date(dataQuantity.datetime).getTime() - new Date(properties.measurements[0].dateTime).getTime() > 3600000) {
                    // Direction data is older than an hour compared to quantity data
                    properties.measurements[0].latestValue = NaN;
                }

                const directionRecord = this.waterinfoPropertiesToSurfsupMapRecord(properties, directionLatest.parameter);
                stationDict[properties.locationCode].properties.data.direction = directionRecord;
            });
        }

        if(labelLatest && labelLatest.features) {
            labelLatest.features.forEach(feature => {
                const properties = feature.properties as WaterinfoProperties;
                if (!(properties.locationCode in stationDict)) {
                    return;
                }
                // TODO check for certain values to ignore (create validation object)
                if (properties.measurements[0].latestValue > 9999) {
                    properties.measurements[0].latestValue = NaN;
                }

                const dataQuantity = stationDict[properties.locationCode].properties.data.quantity;
                if (new Date(dataQuantity.datetime).getTime() - new Date(properties.measurements[0].dateTime).getTime() > 3600000) {
                    // Label data is older than an hour compared to quantity data
                    properties.measurements[0].latestValue = NaN;
                }

                const labelRecord = this.waterinfoPropertiesToSurfsupMapRecord(properties, labelLatest.parameter);
                stationDict[properties.locationCode].properties.data.label = labelRecord;
            });
        }

        for (let locationCode in stationDict) {
            if (locationCode in stationDict) {
                points.push(stationDict[locationCode]);
            }
        }

        return points;
    }

    private waterinfoPropertiesToSurfsupMapRecord(properties: WaterinfoProperties, parameter: WaterinfoParameter): SurfsupMapData {
        const measurement = properties.measurements[0];
        const par: SurfsupMapParameter = {
            id: parameter.slug,
            name: parameter.label,
            unit: measurement.unitCode            
        }

        const surfsupMapRecord: SurfsupMapData = {
            datetime: new Date(measurement.dateTime),
            parameter: par,
            value: measurement.latestValue
        }

        return surfsupMapRecord;
    }

    private getWaterinfoLatest(parameterId: string): Observable<WaterinfoLatest> {
        return Observable.forkJoin(this.getLatest(parameterId), this.getParameterById(parameterId))
            .map(([latestData, parameter]) => {
                const waterinfoLatest: WaterinfoLatest = {
                    parameter: parameter,
                    features: latestData.features
                }
                return waterinfoLatest;
            })
            .catch(err => this.handleError(err));
    }

    getParameterById(parameterId: string): Observable<WaterinfoParameter> {
    
        return this.getGroups()
            .map(groups => {
                let parameter: WaterinfoParameter;
                groups.forEach(group => {
                    const par = group.parameters.find(par => par.slug === parameterId);
                    if(par) {
                        parameter = par;
                    }
                });
               return parameter
            });
    }

    private handleError(error: Response): ErrorObservable {
        console.log(error);
        return Observable.throw(error.statusText);
    }

}
