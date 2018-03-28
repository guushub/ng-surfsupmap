import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import * as L from 'leaflet';
import * as proj4 from "proj4";

import { WaterinfoStation } from '../../map-elements/map-content/waterinfo/waterinfo';
import { WaterinfoMeasurementGroup } from '../../map-elements/map-content/waterinfo/waterinfo-measurement-group';
import { WaterinfoMeasurement } from '../../map-elements/map-content/waterinfo/waterinfo-measurement';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { SurfsupMapPoint, SurfsupMapData } from '../../surfsup-map/surfsup-map-point';
import { SurfsupMapRecord } from '../../surfsup-map/surfsup-map-record';
import { SurfsupMapParameter } from '../../surfsup-map/surfsup-map-parameter';

interface WaterinfoLatestMeasurement {
    latestValue: number;
    dateTime: Date;
    unitCode: string;
    parameterId: string;
}

interface WaterinfoProperties {
    name: string;
    measurements: WaterinfoLatestMeasurement[];
    locationCode: number;
    featured: boolean;
}

interface WaterinfoPoint extends GeoJSON.Point {
    properties: WaterinfoProperties
}

interface WaterinfoParameter {
    label: string;
    slug: string;
    synonyms: any[];
}

interface WaterinfoLatest {
    parameter: WaterinfoParameter;
    features: GeoJSON.Feature<WaterinfoPoint>[];
}

interface WaterinfoGroup {
    label: string;
    defaultFavorite: boolean;
    slug: string;
    parameters: WaterinfoParameter[];
}


@Injectable()
export class WaterinfoService {

    private groupsCache: WaterinfoGroup[] = [];

    constructor(private http: HttpClient) {

    }

    /* API interaction */
    getLatest(parameterIds: string): Observable<GeoJSON.FeatureCollection<WaterinfoPoint>> {
        const url = "http://prodigyrood/dataproxy/Home/WaterinfoLatest";
        // const url = `http://localhost:5050/?`;
        // const params = encodeURIComponent(`http://waterinfo.rws.nl/api/point/latestmeasurements?parameterIds=${parameterIds}`)
        return this.http.get<GeoJSON.FeatureCollection<WaterinfoPoint>>
            (url, {
                params: new HttpParams().set("parameterIds", parameterIds)
                // params: new HttpParams().set("url", params)
            })
            .catch(this.handleError);
    }

    getGroups(): Observable<WaterinfoGroup[]> {
        if(this.groupsCache.length === 0) {
            return new Observable<WaterinfoGroup[]>(observer => {
                observer.next(this.groupsCache);
                observer.complete();
            })
        } else {
            const groupUrl = "https://waterinfo.rws.nl/api/nav/downloadgroups";
            const url = `http://localhost:5050`;
            const params = encodeURIComponent(groupUrl);
            return this.http.get
                (url, {
                    //params: new HttpParams().set("parameterIds", parameterIds)
                    params: new HttpParams().set("url", params)
                })
                .catch(this.handleError);
        }
    }


    getLatestAsSurfsupMapData(parQuantity: string, parDirection?: string, parLabel?: string): Observable<SurfsupMapPoint[]> {
        
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
                
                return this.waterinfoLatestToSurfMapData(quantity, direction, label)
                
            })
            .catch(this.handleError);

    }

    

    /* Transform */
    private waterinfoLatestToSurfMapData(quantityLatest: WaterinfoLatest, directionLatest: WaterinfoLatest, labelLatest: WaterinfoLatest): SurfsupMapPoint[] {
        const points: SurfsupMapPoint[] = [];
        const stationDict: { [locationCode: string]: SurfsupMapPoint } = {};

        quantityLatest.features.forEach(feature => {
            const properties = feature.properties as WaterinfoProperties;
            const location = this.getLatLng(feature.geometry.coordinates)
            const point: SurfsupMapPoint = {
                id: `${properties.locationCode}`,
                data: { quantity: this.waterinfoPropertiesToSurfsupMapRecord(properties, quantityLatest.parameter) },
                location: location
            }

            // TODO check for certain values to ignore
            // if (!measurements || measurements.length <= 0) {
            //     return;
            // }

            stationDict[properties.locationCode] = point;

        });

        if(directionLatest && directionLatest.features) {
            directionLatest.features.forEach(feature => {
                const properties = feature.properties as WaterinfoProperties;

                if (!(properties.locationCode in stationDict)) {
                    return;
                }

                // TODO check for certain values to ignore
                // if (!measurements || measurements.length <= 0) {
                //     return;
                // }
                const direction = this.waterinfoPropertiesToSurfsupMapRecord(properties, directionLatest.parameter);
                stationDict[properties.locationCode].data.direction = direction;
            });
        }

        if(labelLatest && labelLatest.features) {
            labelLatest.features.forEach(feature => {
                const properties = feature.properties as WaterinfoProperties;
                if (!(properties.locationCode in stationDict)) {
                    return;
                }
                // TODO check for certain values to ignore
                // if (!measurements || measurements.length <= 0) {
                //     return;
                // }

                const label = this.waterinfoPropertiesToSurfsupMapRecord(properties, labelLatest.parameter);
                stationDict[properties.locationCode].data.label = label;
            });
        }

        for (let locationCode in stationDict) {
            if (locationCode in stationDict) {
                points.push(stationDict[locationCode]);
            }
        }

        return points;
    }

    private waterinfoPropertiesToSurfsupMapRecord(properties: WaterinfoProperties, parameter: WaterinfoParameter): SurfsupMapRecord {
        const measurement = properties.measurements[0];
        const par: SurfsupMapParameter = {
            id: parameter.slug,
            name: parameter.label,
            unit: measurement.unitCode            
        }

        const surfsupMapRecord: SurfsupMapRecord = {
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

    private getParameterById(parameterId: string): Observable<WaterinfoParameter> {
    
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

    //TODO make projection service.
    private getLatLng(coordinates: number[]) {
        //const coords = proj4("EPSG:3857", "EPSG:4326", [coordinates[1], coordinates[0]]);
        const coords = proj4("+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", [coordinates[0], coordinates[1]]);
        const latLng = L.latLng(coords[1], coords[0]);
        return latLng;
    }

    private handleError(error: Response): ErrorObservable {
        return Observable.throw(error.statusText);
    }

}
