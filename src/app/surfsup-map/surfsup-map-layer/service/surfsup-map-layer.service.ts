import { Injectable, ComponentRef } from '@angular/core';

import { SurfsupMapPopupComponent } from '../../surfsup-map-popup/component/surfsup-map-popup.component';

import { SurfsupMapSymbology } from '../../surfsup-map-symbology';
import * as SurfsupMapIcon from "../../surfsup-map-icon";
import { SurfsupMapPoint } from '../../surfsup-map-point';
import { SurfsupMapRecordGroup } from '../../surfsup-map-record-group';

//TODO create a leaflet layer service and use that instead of these services:
import { MapService } from '../../../leaflet/map/service/map.service';
import { PopupService } from '../../../leaflet/popup/service/popup.service';


interface WaterinfoLayer {
	name: string;
	layer: L.LayerGroup;
	symbology: SurfsupMapSymbology;
}


@Injectable()
export class SurfsupMapLayerService {

	private layers: { [layerId: string]: WaterinfoLayer } = {};
    private locationCodesAllowed = [4755, 2173, 4807, 1310, 3874, 4127, 2719, 4586, 3283, 2721, 2175, 1073, 1617, 1092, 1075, 3905, 4953, 4455, 4864, 4865, 516];

	constructor(private mapService: MapService, private popupService: PopupService) { }

	addLayer(points: SurfsupMapPoint[], symbology: SurfsupMapSymbology, legendText?: string) {
		
		const markers: L.Marker[] = [];
		points.forEach(point => {
			if(point.properties.group.toLowerCase() === "wind" && this.locationCodesAllowed.indexOf(Number(point.properties.locationCode)) === -1) {
				return;
			}

			const marker = point.marker(symbology);
			const setInstanceData = (componentRef: ComponentRef<SurfsupMapPopupComponent>) => {
				componentRef.instance.init(point);
			}
			this.popupService.register(marker, SurfsupMapPopupComponent, setInstanceData);
			markers.push(marker);
			
		});

		const layerId = this.mapService.addLayerGroup(markers);
		if(legendText) {
			this.addLayerOverlay(this.mapService, layerId, legendText, symbology);
		}
	}

	private addLayerOverlay(mapService: MapService, layerId: number, legendText: string, symbology: SurfsupMapSymbology) {
		const layerDescription = this.getLayerDescription(layerId, legendText, symbology);
		mapService.addOverlay(layerId, layerDescription);
	}

	private getLayerDescription (layerId: number, legendText: string, symbology: SurfsupMapSymbology) {
		const legendIcon = this.getLegendIcon(layerId, legendText, symbology);
        if(!legendIcon) {
            return;
        }

		const layerDescription = `${legendIcon.options.html} ${legendText}`;
		return layerDescription;
	}

	private getLegendIcon(layerId: number, legendText: string, symbology: SurfsupMapSymbology) {
		const properties: SurfsupMapIcon.SurfsupMapIconOptions = {
			data: null,
			symbologyOptions: symbology
		}

		const icon = SurfsupMapIcon.get(properties, true);

		return icon;
	}
}
