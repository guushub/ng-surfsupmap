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

    private handleError(error: Response): ErrorObservable {
        console.error(error);
        return Observable.throw(error.statusText);
    }

}
