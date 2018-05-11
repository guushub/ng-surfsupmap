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
import { MapComponent } from './leaflet/map/component/map/map.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(private mapService: MapService, private regionControlService: RegionControlService) {
		
	}

	ngOnInit() {
		
		this.mapService.onLoad.subscribe((map: L.Map) => {
			this.mapService.injectComponentToControl(WaterinfoLayerComponent, "topleft");
			this.mapService.injectComponentToControl(WaterinfoRawControlComponent, "topleft");
			
		});

		this.regionControlService.addComponentToRegion("MapComponent", RegionName.MapRegion, MapComponent, true, (isActive: boolean) => {
			// TODO: this should be in the component's behavior.
			setTimeout(() => {
				if(!isActive) {
					this.mapService.map.remove()
				}
				
				if(isActive) {
					//TODO: this should also restore the earlier added layers, not just restore the initial situation.
					this.mapService.resetView();
					this.mapService.map.invalidateSize();
				  }
			  }, 0);
		});
		this.regionControlService.addComponentToRegion("WaterinfoRawComponent", RegionName.DataRegion, WaterinfoRawComponent);

	}

}
