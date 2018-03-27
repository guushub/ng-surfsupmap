import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class WaterinfoService {


    constructor(private http: HttpClient) {

    }

    getLatest(parameterIds: string): Observable<GeoJSON.FeatureCollection<GeoJSON.Point>> {
        //const url = "http://prodigyrood/dataproxy/Home/WaterinfoLatest";
        const url = `http://localhost:5050/?`;
        const params = encodeURIComponent(`http://waterinfo.rws.nl/api/point/latestmeasurements?parameterIds=${parameterIds}`)
        return this.http.get
            (url, {
                //params: new HttpParams().set("parameterIds", parameterIds)
                params: new HttpParams().set("url", params)
            })
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }

}
