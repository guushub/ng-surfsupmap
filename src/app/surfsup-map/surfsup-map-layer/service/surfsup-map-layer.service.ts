import { Injectable, ComponentRef } from '@angular/core';
import * as L from 'leaflet';

import { SurfsupMapPopupComponent } from '../../surfsup-map-popup/component/surfsup-map-popup.component';
//import { SurfsupMapSymbology } from '../../surfsup-map-symbology';
//import * as SurfsupMapIcon from "../../surfsup-map-icon";
//import { SurfsupMapPoint } from '../../surfsup-map-point';

import { PopupService } from '../../../leaflet/popup/service/popup.service';
import { LayerService } from '../../../leaflet/layer/service/layer.service';
import { Layer } from '../../../leaflet/layer/model/layer';
import { SurfsupMapIconService } from '../../surfsup-map-icon/service/surfsup-map-icon.service';
import { SurfsupMapLayer, SurfsupMapLocation } from '../model/surfsup-map-layer';

@Injectable()
export class SurfsupMapLayerService {

    private locationCodesAllowed = [4755, 2173, 4807, 1310, 3874, 4127, 2719, 4586, 3283, 2721, 2175, 1073, 1617, 1092, 1075, 3905, 4953, 4455, 4864, 4865, 516];

	constructor(private popupService: PopupService, 
		private layerService: LayerService, private iconService: SurfsupMapIconService) { }
	
	addLayer(surfsupMapLayer: SurfsupMapLayer) {
		
		const markers: L.Marker[] = [];
		surfsupMapLayer.locations.forEach(location => {
			const icon = this.iconService.getIcon(location.quantityData, location.directionData, location.labelData, 
				surfsupMapLayer.iconProperties, false);

			const marker = L.marker(location.latLng, {icon: icon});	
			this.bindPopup(marker, location);
			markers.push(marker);
			
		});

		const legendIcon = this.iconService.getLegendIcon(surfsupMapLayer.iconProperties);
		const layerDescription = this.getLayerDescription(surfsupMapLayer.legendText, legendIcon);
		const layer = new Layer(markers, layerDescription, true);
		this.layerService.add(layer);
	}

	private bindPopup(marker: L.Marker, location: SurfsupMapLocation) {
		const setInstanceData = (componentRef: ComponentRef<SurfsupMapPopupComponent>) => {
			componentRef.instance.init(location);
		}
		this.popupService.register(marker, SurfsupMapPopupComponent, setInstanceData);
	}

	private getLayerDescription (legendText: string, legendIcon: L.DivIcon) {
        if(!legendIcon) {
            return legendText;
        }

		const layerDescription = `${legendIcon.options.html} ${legendText}`;
		return layerDescription;
	}

}
