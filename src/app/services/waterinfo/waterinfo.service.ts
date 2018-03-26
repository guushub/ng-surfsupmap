import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class WaterinfoService {


    constructor(private http: HttpClient) {

    }

    getLatest(parameterIds: string): Observable<GeoJSON.FeatureCollection<GeoJSON.Point>> {
        const url = "http://prodigyrood/dataproxy/Home/WaterinfoLatest";
        return this.http.get
            (url, {
                params: new HttpParams().set("parameterIds", parameterIds)
            })
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }

}
