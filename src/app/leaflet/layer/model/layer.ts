import * as L from 'leaflet';

export class Layer {
    private id: number;
    private layerGroup: L.LayerGroup;

    constructor(public markers: L.Marker[], public layerDescription: string, public includeInLegend: boolean) {

    }

    createLayerGroup(layerId: number, paneId: string) {
        this.layerGroup = L.layerGroup(this.markers, {pane: paneId});
        this.id = layerId;
        return this.layerGroup;
    }

    getId() {
        return this.id;
    }
}
