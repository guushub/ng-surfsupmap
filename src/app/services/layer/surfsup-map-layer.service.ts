import { Injectable, ComponentRef } from '@angular/core';
import { MapMainService } from '../map/map-main.service';

import { PopupService } from '../popup/popup.service';
import { SurfsupMapPopupComponent } from '../../components/popup/surfsup-map-popup/surfsup-map-popup.component';

import { SurfsupMapSymbology } from '../../surfsup-map/surfsup-map-symbology';
import * as SurfsupMapIcon from "../../surfsup-map/surfsup-map-icon";
import { SurfsupMapPoint } from '../../surfsup-map/surfsup-map-point';
import { SurfsupMapRecordGroup } from '../../surfsup-map/surfsup-map-record-group';


interface WaterinfoLayer {
	name: string;
	layer: L.LayerGroup;
	symbology: SurfsupMapSymbology;
}


@Injectable()
export class SurfsupMapLayerService {

	private layers: { [layerId: string]: WaterinfoLayer } = {};
    private locationCodesAllowed = [4755, 2173, 4807, 1310, 3874, 4127, 2719, 4586, 3283, 2721, 2175, 1073, 1617, 1092, 1075, 3905, 4953, 4455, 4864, 4865, 516];

	constructor(private mapService: MapMainService, private popupService: PopupService) { }

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

	private addLayerOverlay(mapService: MapMainService, layerId: number, legendText: string, symbology: SurfsupMapSymbology) {
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
