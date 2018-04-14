import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../leaflet/map/service/map.service';
//TODO for refactor: Maybe use directive.

@Component({
	selector: 'app-waterinfo-raw-control',
	templateUrl: './waterinfo-raw-control.component.html',
	styleUrls: ['./waterinfo-raw-control.component.css']
})
export class WaterinfoRawControlComponent implements OnInit {

	constructor(private mapService: MapService) { }

	ngOnInit() {
		
	}

	showWaterinfoRaw() {
		// Hide the map.
		this.mapService.hide.emit(true);
	}
}
