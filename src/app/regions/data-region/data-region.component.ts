import { Component, OnInit } from '@angular/core';
import { MapService } from '../../leaflet/map/service/map.service';

@Component({
  selector: 'app-data-region',
  templateUrl: './data-region.component.html',
  styleUrls: ['./data-region.component.css']
})
export class DataRegionComponent implements OnInit {
  isActive = false;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.hide.subscribe(hideMap => {
			this.isActive=hideMap;
		});
  }

}
