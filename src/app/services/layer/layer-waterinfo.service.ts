import { Injectable } from '@angular/core';
import { WaterInfoSymbologyCalculated } from '../../map-elements/symbology/symbology';
import { MapMainService } from '../map/map-main.service';
import * as WaterInfoIcon from '../../map-elements/map-content/water-info-old/water-info-icon';

interface WaterinfoLayer {
	name: string;
	layer: L.LayerGroup;
	symbology: WaterInfoSymbologyCalculated;
}


@Injectable()
export class LayerWaterinfoService {

	private layers: { [layerId: string]: WaterinfoLayer } = {};

	constructor(private mapService: MapMainService) { }

	addLayer(markers: L.Marker[], symbology: WaterInfoSymbologyCalculated, legendText?: string) {
		//const layerDescription = this.getLayerDescription()
		const layerId = this.mapService.addLayerGroup(markers);
		if(legendText) {
			this.addLayerOverlay(this.mapService, layerId, legendText, symbology);
		}
	}

	private addLayerOverlay(mapService: MapMainService, layerId: number, legendText: string, symbology: WaterInfoSymbologyCalculated) {
		const layerDescription = this.getLayerDescription(layerId, legendText, symbology);
		mapService.addOverlay(layerId, layerDescription);
	}

	private getLayerDescription (layerId: number, legendText: string, symbology: WaterInfoSymbologyCalculated) {
		const legendIcon = this.getLegendIcon(layerId, legendText, symbology);
        //const layer = this.getLayerById(layerId);
        if(!legendIcon) {
            return;
        }

		const layerDescription = `${legendIcon.options.html} ${legendText}`;
		return layerDescription;
	}

	private getLegendIcon(layerId: number, legendText: string, symbology: WaterInfoSymbologyCalculated) {

		const icon = WaterInfoIcon.get({
			id: `${layerId}-marker-legend`,
			value: symbology.legendIconValue,
			label: `${symbology.legendIconValue}`,
			direction: 270,
			className: `${layerId}-marker`,
			symbologyOptions: symbology
		});

		return icon;
	}
}
