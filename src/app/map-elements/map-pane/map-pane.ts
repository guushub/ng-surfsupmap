import { Map } from 'leaflet';

export class MapPane {

    constructor(public paneName: string, private zIndex: number) {}

    add(map: Map) {
        map.createPane(this.paneName);
        map.getPane(this.paneName).style.zIndex = this.zIndex.toString();
    }

}