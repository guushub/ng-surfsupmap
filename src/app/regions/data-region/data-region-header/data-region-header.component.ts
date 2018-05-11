import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../leaflet/map/service/map.service';
import { RegionControlService } from '../../region-control.service';

@Component({
  selector: 'app-data-region-header',
  templateUrl: './data-region-header.component.html',
  styleUrls: ['./data-region-header.component.css']
})
export class DataRegionHeaderComponent implements OnInit {

  constructor(private mapService: MapService, private regionControlService: RegionControlService) { }

  ngOnInit() {

  }

  showMap() {
    this.regionControlService.activateComponent("MapComponent");
		// this.mapService.hide.emit(false)
  }
  
}
