import { Injectable, ComponentRef } from '@angular/core';

import { SurfsupMapPopupComponent } from '../../surfsup-map-popup/component/surfsup-map-popup.component';
import { SurfsupMapSymbology } from '../../surfsup-map-symbology';
import * as SurfsupMapIcon from "../../surfsup-map-icon";
import { SurfsupMapPoint } from '../../surfsup-map-point';
import { SurfsupMapRecordGroup } from '../../surfsup-map-record-group';

import { PopupService } from '../../../leaflet/popup/service/popup.service';
import { LayerService } from '../../../leaflet/layer/service/layer.service';
import { Layer } from '../../../leaflet/layer/model/layer';


interface WaterinfoLayer {
	name: string;
	layer: L.LayerGroup;
	symbology: SurfsupMapSymbology;
}


@Injectable()
export class SurfsupMapLayerService {

	private layers: { [layerId: string]: WaterinfoLayer } = {};
    private locationCodesAllowed = [4755, 2173, 4807, 1310, 3874, 4127, 2719, 4586, 3283, 2721, 2175, 1073, 1617, 1092, 1075, 3905, 4953, 4455, 4864, 4865, 516];

	constructor(private popupService: PopupService, 
		private layerService: LayerService) { }

	addLayer(points: SurfsupMapPoint[], symbology: SurfsupMapSymbology, legendText: string) {
		
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

		const layerDescription = this.getLayerDescription(legendText, symbology);
		const layer = new Layer(markers, layerDescription, true);
		this.layerService.add(layer);
	}

	private getLayerDescription (legendText: string, symbology: SurfsupMapSymbology) {
		const legendIcon = this.getLegendIcon(legendText, symbology);
        if(!legendIcon) {
            return legendText;
        }

		const layerDescription = `${legendIcon.options.html} ${legendText}`;
		return layerDescription;
	}

	private getLegendIcon(legendText: string, symbology: SurfsupMapSymbology) {
		const properties: SurfsupMapIcon.SurfsupMapIconOptions = {
			data: null,
			symbologyOptions: symbology
		}

		const icon = SurfsupMapIcon.get(properties, true);

		return icon;
	}
}
