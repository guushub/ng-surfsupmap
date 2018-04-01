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
export class SurfsupLayerMapService {

	private layers: { [layerId: string]: WaterinfoLayer } = {};

	constructor(private mapService: MapMainService, private popupService: PopupService) { }

	addLayer(points: SurfsupMapPoint[], symbology: SurfsupMapSymbology, legendText?: string) {
		
		const markers: L.Marker[] = [];
		points.forEach(point => {
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
		const data: SurfsupMapRecordGroup = {
			quantity: {
				datetime: new Date(), 
				value: symbology.legendIconValue,
				parameter: null
			},
			direction: {
				datetime: new Date(), 
				value: 270,
				parameter: null
			},
			label: {
				datetime: new Date(), 
				value: symbology.legendIconValue,
				parameter: null
			}
		}
		const properties: SurfsupMapIcon.SurfsupMapIconOptions = {
			data: data,
			symbologyOptions: symbology
		}

		const icon = SurfsupMapIcon.get(properties);

		return icon;
	}
}
