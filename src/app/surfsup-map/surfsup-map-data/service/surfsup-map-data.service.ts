import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { SurfsupMapData, SurfsupMapParameter } from '../model/surfsup-map-data';
import { WaterinfoService } from '../../../waterinfo/service/waterinfo.service';

@Injectable()
export class SurfsupMapDataService {

  constructor(private waterinfoService: WaterinfoService) { }

  getLatestFromWaterinfo(parameter: SurfsupMapParameter): Observable<SurfsupMapData[]> {
    parameter.id
    return;
  }

}
