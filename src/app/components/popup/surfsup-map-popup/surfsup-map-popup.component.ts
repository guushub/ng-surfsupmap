import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { SurfsupMapPoint } from '../../../surfsup-map/surfsup-map-point';

@Component({
  selector: 'app-surfsup-map-popup',
  templateUrl: './surfsup-map-popup.component.html',
  styleUrls: ['./surfsup-map-popup.component.css']
})
export class SurfsupMapPopupComponent implements OnInit, OnDestroy {
  private point: SurfsupMapPoint;
  private waterinfoUrl: string;
  private title: string;

  constructor() { }

  ngOnInit() {
    
  }

  ngOnDestroy() {

  }
  
  init(point: SurfsupMapPoint) {
    this.point = point;
    this.waterinfoUrl = this.getWaterInfoUrl(point);
  }

  private getWaterInfoUrl(point: SurfsupMapPoint): string {
    const parameters: string[] = [];
    parameters.push(point.properties.data.quantity.parameter.id);
    if(point.properties.data.direction && parameters.indexOf(point.properties.data.direction.parameter.id) < 0) parameters.push(point.properties.data.direction.parameter.id);
    if(point.properties.data.label && parameters.indexOf(point.properties.data.label.parameter.id) < 0) parameters.push(point.properties.data.label.parameter.id);
    
    const url  = `https://waterinfo.rws.nl/#!/details/expert/${point.properties.group}/${point.properties.locationCode}/${parameters.join(",")}`
    return url;
  }

  private setTitle(point: SurfsupMapPoint) {

  }
}
