import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';

@Component({
  selector: 'app-surfsup-map-popup',
  templateUrl: './surfsup-map-popup.component.html',
  styleUrls: ['./surfsup-map-popup.component.css']
})
export class SurfsupMapPopupComponent implements OnInit, OnDestroy {
  public name: string;
  public waterinfoUrl: string;
  public value: number; 
  public unit: string;
  public datetime: Date;

  constructor() { }

  ngOnInit() {
    
  }

  ngOnDestroy() {

  }
}
