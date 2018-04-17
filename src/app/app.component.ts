import { Component } from '@angular/core';
import * as L from 'leaflet';

// services for map control
import { MapService } from './leaflet/map/service/map.service';

// Stuff to initialize after app init
import { WaterinfoLayerComponent } from './waterinfo/component/waterinfo-layer/waterinfo-layer.component';
import { WaterinfoRawControlComponent } from './waterinfo/component/waterinfo-raw-control/waterinfo-raw-control.component';
import { RegionControlService } from './regions/region-control.service';
import { RegionName } from './regions/model/region-name';
import { WaterinfoRawComponent } from './waterinfo/component/waterinfo-raw/waterinfo-raw.component';
import { DummyComponent } from './dummy/dummy.component';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	hideMap = false;

	constructor(private mapService: MapService, private regionControlService: RegionControlService) {
		
	}

	ngOnInit() {
		
		this.mapService.onLoad.subscribe((map: L.Map) => {
			this.mapService.injectComponentToControl(WaterinfoLayerComponent, "topleft");
			this.mapService.injectComponentToControl(WaterinfoRawControlComponent, "topleft");
			
		});

		this.regionControlService.addComponentToRegion("DummyComponent", RegionName.MapRegion, DummyComponent);
		this.regionControlService.addComponentToRegion("WaterinfoRawComponent", RegionName.DataRegion, WaterinfoRawComponent);
	

		this.mapService.hide.subscribe((hide) => {
			this.hideMap = hide;
		  });
	}

}
