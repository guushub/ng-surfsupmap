import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../leaflet/map/service/map.service';

@Component({
  selector: 'app-waterinfo-raw',
  templateUrl: './waterinfo-raw.component.html',
  styleUrls: ['./waterinfo-raw.component.css']
})
export class WaterinfoRawComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  showMap() {
    this.mapService.hide.emit(false)
  }

}
