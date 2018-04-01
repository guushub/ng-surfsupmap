import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-surfsup-map-layer-add',
  templateUrl: './surfsup-map-layer-add.component.html',
  styleUrls: ['./surfsup-map-layer-add.component.css']
})
export class SurfsupMapLayerAddComponent implements OnInit {
  public active: boolean;
  constructor() { }

  ngOnInit() {
    this.active = false;
  }

}
