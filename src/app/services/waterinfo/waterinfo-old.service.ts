import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { latLng } from 'leaflet';

// import { WaterInfoRecord, IRwsFeature } from '../../map-elements/map-content/water-info-old/water-info-record';

// interface WaterInfoRecords {
//   waves: WaterInfoRecord[];
//   wind: WaterInfoRecord[];
// }

@Injectable()
export class WaterinfoOldService {

  // //private waterInfoJsonUrl = 'http://ec2-52-58-96-117.eu-central-1.compute.amazonaws.com/';  // URL to web api
  // private waterInfoJsonUrl = '/assets/water-info-data.json';

  // constructor(private http: Http) { }
  // getWaterInfoRecords(): Promise<WaterInfoRecords> {
  //   return this.http.get(this.waterInfoJsonUrl)
  //     .toPromise()
  //     .then(response => {
  //       const rwsFeatures = response.json().features as IRwsFeature[];
  //       const results: WaterInfoRecords = {waves: [], wind: []};
  //       results.waves = this.transformRwsFeatures("H1d3", "Th0_B0", rwsFeatures);
  //       results.wind = this.transformRwsFeatures("WC10", "WR10", rwsFeatures);

  //       return results;
  //     })
  //     .catch(this.handleError);
  // }

  // private handleError(error: any): Promise<any> {
  //   console.error('An error occurred', error);
  //   return Promise.reject(error.message || error);
  // }

  // private transformRwsFeatures(parHeight: string, parDirection: string, rwsFeatures: IRwsFeature[], nanValue: number = 99999) {
  //   let waterInfoRecords: WaterInfoRecord[] = [];
  //   const locationNames = rwsFeatures.map((feature) => { return feature.loc });

  //   // remove duplicates
  //   const locationsToGet = locationNames.filter((elem, index, self) => index == self.indexOf(elem));

  //   locationsToGet.forEach((locationCode) => {
  //     const locationVals = rwsFeatures.filter(feature => locationCode.toLowerCase() === feature.loc.toLowerCase());
  //     const locationDirection = locationVals.filter(feature => feature.par === parDirection);
  //     const locationHeight = locationVals.filter(feature => feature.par === parHeight);

  //     if (locationHeight.length > 0 && locationDirection.length > 0) {
  //       const coords = [parseFloat(locationHeight[0].location.lon), parseFloat(locationHeight[0].location.lat)];

  //       if (locationHeight[0].meettijd === locationDirection[0].meettijd && locationHeight[0].meettijd != null) {
  //         // Only when meettijd of all sensors is equal, then its a valid record for our purpous
  //         waterInfoRecords.push({
  //           value: parseInt(locationHeight[0].waarde) === nanValue ? NaN : parseFloat(locationHeight[0].waarde),
  //           direction: parseInt(locationDirection[0].waarde) === nanValue ? NaN : parseInt(locationDirection[0].waarde),
  //           location: latLng(parseFloat(locationHeight[0].location.lat), parseFloat(locationHeight[0].location.lon))
  //         })
  //       }
  //     }
  //   });

  //   return waterInfoRecords;
  // }
}
