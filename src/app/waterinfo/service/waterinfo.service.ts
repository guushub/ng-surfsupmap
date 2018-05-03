import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/Rx';

import { environment } from 'environments/environment';

import * as Waterinfo from '../model/waterinfo';
import { WaterinfoUtils } from '../helper/waterinfo-utils';

@Injectable()
export class WaterinfoService {

    private groups: Observable<Waterinfo.WaterinfoGroup[]>;
    
    constructor(private http: HttpClient) {

    }

    getGroups(): Observable<Waterinfo.WaterinfoGroup[]> {
        if(!this.groups) {
            const url = environment.proxyUrl;
            const params = encodeURIComponent("https://waterinfo.rws.nl/api/nav/allgroups");
            this.groups = this.http.get<Observable<Waterinfo.WaterinfoGroup[]>>(`${url}?${params}`)
            .publishReplay(1) //cache
            .refCount()
            .catch(this.handleError);;
        } 
        
        return this.groups;
    }

    getParametersCombined(parameterIds: string[]) {
        const getLatestObservables = parameterIds.map(parameterId => this.getParameterById(parameterId));
        return Observable.forkJoin(getLatestObservables);
    }

    getLatest(parameterIds: string[]): Observable<GeoJSON.FeatureCollection<Waterinfo.WaterinfoPoint>>  {
        const url = environment.proxyUrl;
        const queryString = parameterIds.map(parameterId => `parameterIds=${parameterId}`).join("&");
        const params = encodeURIComponent(`http://waterinfo.rws.nl/api/point/latestmeasurements?${queryString}`)
        return this.http.get<GeoJSON.FeatureCollection<Waterinfo.WaterinfoPoint>>(`${url}?${params}`)
            .catch(this.handleError);
    }

    getParameterById(parameterId: string): Observable<Waterinfo.WaterinfoParameter> {
    
        return this.getGroups()
            .map(groups => {
                let parameter: Waterinfo.WaterinfoParameter;
                groups.forEach(group => {
                    const par = group.parameters.find(par => par.slug === parameterId);
                    if(par) {
                        parameter = par;
                    }
                });
               return parameter
            });
    }

    getLatestAsMatTableData(groupsAllowed: string[] = ["golven", "wind", "watertemperatuur"]) {
        return this.getGroups()
		.flatMap(groups => {
            groupsAllowed = groupsAllowed.map(group => group.toLowerCase());
            const groupedParameters = groups.filter(group => groupsAllowed.indexOf(group.slug.toLowerCase()) > -1).map(group => group.parameters);
            
            const forkJoinInputs = groupedParameters.map(parameters => this.getLatest(parameters.map(par => par.slug)));
            
            let allParameters: Waterinfo.WaterinfoParameter[] = [];
            groupedParameters.forEach(parameters => {
                allParameters = allParameters.concat(...parameters);
            });

            return Observable.forkJoin(forkJoinInputs)
			.map(collections => {
                const matTableData = this.groupedCollectionsToMatTableData(collections, allParameters);
                return matTableData;
            });
		})

    }

    private groupedCollectionsToMatTableData(collections: GeoJSON.FeatureCollection<Waterinfo.WaterinfoPoint>[],
         requestedParameters: Waterinfo.WaterinfoParameter[]) {
        let locationData: Waterinfo.WaterinfoMatDataSource[] = [];
        const locationDataDict: {[locationCode: number]: Waterinfo.WaterinfoMatDataSource[]} = {};
        const parameterDict: {[slug: string]: Waterinfo.WaterinfoParameter} = {};

        requestedParameters.forEach(par => {
            parameterDict[par.slug] = par;
        });

        let i = 0;
        collections.forEach(col => {
            const properties = col.features.map(feature => feature.properties) as Waterinfo.WaterinfoProperties[]; 
            properties.forEach(prop => {
                const locationCode = prop.locationCode;
                const locationName = prop.name;
                let measurements = prop.measurements;

                if(i === 0 && !locationDataDict[locationCode]) {
                    locationDataDict[locationCode] = measurements.map(measurement => {
                        return this.getWaterinfoMatDataSourceFromLatest(locationCode, locationName, parameterDict[measurement.parameterId], measurement);
                    });
                        
                } else if(locationDataDict[locationCode]) {
                    const matDataSources = measurements.map(measurement => {
                        return this.getWaterinfoMatDataSourceFromLatest(locationCode, locationName, parameterDict[measurement.parameterId], measurement);
                    });
                    locationDataDict[locationCode] = locationDataDict[locationCode].concat(...matDataSources);
                }
            });
            i++;
        });

        for (const key in locationDataDict) {
            if (locationDataDict.hasOwnProperty(key)) {
                const locationCode = key;
                const measurements = locationDataDict[locationCode]; 
                locationData = locationData.concat(...measurements);
            }
        }

        return locationData;
    }


    private getWaterinfoMatDataSourceFromLatest(locationCode: number, locationName: string, 
        parameter: Waterinfo.WaterinfoParameter, measurement: Waterinfo.WaterinfoLatestMeasurement) {

        return {
            locationName: locationName,
            locationCode: locationCode,
            parameterId: parameter.slug,
            parameterName: parameter.label,
            value: measurement.latestValue,
            datetime: measurement.dateTime,
            unit: measurement.unitCode
        }
    }

    private handleError(error: Response): ErrorObservable {
        console.error(error);
        return Observable.throw(error.statusText);
    }

}
