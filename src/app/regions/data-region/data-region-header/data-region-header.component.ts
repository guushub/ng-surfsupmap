import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../leaflet/map/service/map.service';

@Component({
  selector: 'app-data-region-header',
  templateUrl: './data-region-header.component.html',
  styleUrls: ['./data-region-header.component.css']
})
export class DataRegionHeaderComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {

  }

  showMap() {
		this.mapService.hide.emit(false)
  }
  
}
