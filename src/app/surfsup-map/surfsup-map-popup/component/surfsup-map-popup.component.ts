import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { SurfsupMapLocation } from '../../surfsup-map-layer/model/surfsup-map-layer';

@Component({
  selector: 'app-surfsup-map-popup',
  templateUrl: './surfsup-map-popup.component.html',
  styleUrls: ['./surfsup-map-popup.component.css']
})
export class SurfsupMapPopupComponent implements OnInit, OnDestroy {
  location: SurfsupMapLocation;

  constructor() { }

  ngOnInit() {
    
  }

  ngOnDestroy() {

  }
  
  init(location: SurfsupMapLocation) {
    this.location = location;
  }

}
