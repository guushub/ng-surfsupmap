import { Component } from '@angular/core';
import * as L from 'leaflet';

// services for map control
import { MapService } from './leaflet/map/service/map.service';

// Stuff to initialize after app init
import { WaterinfoLayerComponent } from './waterinfo/component/waterinfo-layer/waterinfo-layer.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(private mapService: MapService) {
		
	}

	ngOnInit() {
		this.mapService.onLoad.subscribe((map: L.Map) => {
			console.log(map);
			this.mapService.injectComponentToControl(WaterinfoLayerComponent, "topleft");
		})

		//;	
	}
}
