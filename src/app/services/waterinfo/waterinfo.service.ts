import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import { WaterinfoStation } from '../../map-elements/map-content/waterinfo/waterinfo';
import { WaterinfoMeasurementGroup } from '../../map-elements/map-content/waterinfo/waterinfo-measurement-group';
import { WaterinfoMeasurement } from '../../map-elements/map-content/waterinfo/waterinfo-measurement';

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

    getWaterinfoStationsLatest(parQuantity: string, parDirection?: string, parLabel?: string) {
        const getLatestObservables = [
            this.getLatest(parQuantity)
        ]

        if(parDirection) {
            getLatestObservables.push(
                this.getLatest(parDirection)
            )
        }

        if(parLabel) {
            getLatestObservables.push(
                this.getLatest(parLabel)
            )
        }
        
        Observable.forkJoin(getLatestObservables)
        .subscribe((results) => {
            console.log(results);
        })
            // .subscribe((results) => {
            //     console.log(results);
            // })
    }

    private getWaterinfoMeasurementGroup(): WaterinfoMeasurementGroup {
        return;
    }

    private getWaterinfoMeasurement(): WaterinfoMeasurement {
        return;
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }

}
