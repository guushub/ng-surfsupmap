import { Injectable } from '@angular/core';
import { MapMainService } from '../map/map-main.service';
import { SurfsupMapSymbology } from '../../surfsup-map/surfsup-map-symbology';
import * as SurfsupMapIcon from "../../surfsup-map/surfsup-map-icon";
import { SurfsupMapPoint, SurfsupMapData } from '../../surfsup-map/surfsup-map-point';
import * as SurfsupMapMarker from "../../surfsup-map/surfsup-map-marker";
import { PopupService } from '../popup/popup.service';


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
//		addLayer(markers: L.Marker[], symbology: SurfsupMapSymbology, legendText?: string) {
		//const layerDescription = this.getLayerDescription()
		
		const markers: L.Marker[] = [];
		points.forEach(point => {
			const markerOptions: SurfsupMapMarker.SurfsupMapMarkerOptions = {
				point: point,
				symbology: symbology
			}
			const marker = SurfsupMapMarker.get(markerOptions);
			this.popupService.register(marker, "Hoi");
			markers.push(marker);
			// marker.bindPopup(`
			// 	<div>
			// 	<h3>Popup!</h3>
			// 	<ng-template appPopup></ng-template>
			// 	</div>
			// `);

			// marker.on('click', (e) => {

			// 	console.log("click");
			// });
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
        //const layer = this.getLayerById(layerId);
        if(!legendIcon) {
            return;
        }

		const layerDescription = `${legendIcon.options.html} ${legendText}`;
		return layerDescription;
	}

	private getLegendIcon(layerId: number, legendText: string, symbology: SurfsupMapSymbology) {
		const data: SurfsupMapData = {
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
