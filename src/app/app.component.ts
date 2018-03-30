import { Component } from '@angular/core';
import * as L from 'leaflet';

// components
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

// services for data
import { WaterinfoService } from './services/waterinfo/waterinfo.service';

// services for map control
import { MapMainService } from './services/map/map-main.service';
import { SurfsupLayerMapService } from './services/layer/surfsup-map-layer.service';

// Stuff
import * as SurfsupMapTheme from "./surfsup-map/surfsup-map-theme";



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	constructor(private mapMainService: MapMainService,
		private waterInfoService: WaterinfoService,
		private surfsupMapLayerService: SurfsupLayerMapService) {

	}

	ngOnInit() {
		this.mapMainService.setMap("map-main");

		this.waterInfoService.getLatestAsSurfsupMapData(
			"Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm",
			"Gemiddelde___20golfrichting___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20graad",
			"Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm"
		)
		.subscribe((points) => {
			const symbology = SurfsupMapTheme.getSymbologyByTheme(
				SurfsupMapTheme.ThemeType.cm,
				SurfsupMapTheme.ThemeColor.purple
			)

			const legendText = points[0].data.quantity.parameter.name;

			this.surfsupMapLayerService.addLayer(points, symbology, legendText);
		});

		this.waterInfoService.getLatestAsSurfsupMapData(
			"Windsnelheid___20Lucht___20t.o.v.___20Mean___20Sea___20Level___20in___20m___2Fs",
			"Windrichting___20Lucht___20t.o.v.___20ware___20Noorden___20in___20graad",
			"Windsnelheid___20Lucht___20t.o.v.___20Mean___20Sea___20Level___20in___20m___2Fs"
		)
		.subscribe((points) => {
			const symbology = SurfsupMapTheme.getSymbologyByTheme(
				SurfsupMapTheme.ThemeType["m/s"],
				SurfsupMapTheme.ThemeColor.orange
			)

			const legendText = points[0].data.quantity.parameter.name;

			this.surfsupMapLayerService.addLayer(points, symbology, legendText);
		});

	}

}
