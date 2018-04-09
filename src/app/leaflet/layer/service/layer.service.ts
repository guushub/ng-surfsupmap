import { Injectable } from '@angular/core';
import { MapService } from '../../map/service/map.service';

import * as L from 'leaflet';
import { Layer } from '../model/layer';

@Injectable()
export class LayerService {

	private layers: Layer[] = [];
    private zIndexBase = 600;

	constructor(private mapService: MapService) { }

	add(layer: Layer) {

		// Need a layerID and pane to identify markers as part of a group
		const layerId = this.getNewLayerGroupId();
		const paneId = this.addPane(layerId);
		
		// Create and add layer.
		const layerGroup = layer.createLayerGroup(layerId, paneId);
		this.layers.push(layer);
				
		this.mapService.map.addLayer(layerGroup);
		
		// Add it to layercontrol if it has a description
		if(layer.includeInLegend) {
			this.mapService.layerControl.addOverlay(layerGroup, layer.layerDescription);
		}

		return layerId;
	}

	private getNewLayerGroupId() {
		let maxIdCurrent = 0;
		if(this.layers.length <= 0) {
				return maxIdCurrent;
		}

		this.layers.forEach((layer) => {
			const n = layer.getId();
			maxIdCurrent = n > maxIdCurrent ? n : maxIdCurrent;
		})
		return maxIdCurrent + 1;
	}

	private addPane(layerId: number) {
        const paneId = `pane-${layerId}`;
        const zIndex = this.zIndexBase + 5 * layerId;

        if (!this.mapService.map.getPane(paneId)) {
            this.mapService.map.createPane(paneId);
        }
        this.mapService.map.getPane(paneId).style.zIndex = zIndex.toString();

        return paneId;
    }
}
