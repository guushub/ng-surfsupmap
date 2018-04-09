import { Component } from '@angular/core';
import * as L from 'leaflet';

// services for map control
import { MapService } from './leaflet/map/service/map.service';

// Stuff to initialize after app init
import { SurfsupMapLayerComponent } from './surfsup-map/surfsup-map-layer/component/surfsup-map-layer.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	constructor(private mapMainService: MapService) {
	}

	ngOnInit() {
		this.mapMainService.setMap("map-main");
		this.mapMainService.injectComponentToControl(SurfsupMapLayerComponent, "topleft");	
	}
}
