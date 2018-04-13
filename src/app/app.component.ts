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
	hideMap = false;
	constructor(private mapService: MapService) {
		
	}

	ngOnInit() {
		this.mapService.onLoad.subscribe((map: L.Map) => {
			this.mapService.injectComponentToControl(WaterinfoLayerComponent, "topleft");
		})

		this.mapService.hide.subscribe((hide) => {
			console.log(hide);
			this.hideMap = hide;
		  });
	}
}
