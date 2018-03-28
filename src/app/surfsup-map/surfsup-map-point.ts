import { SurfsupMapRecord } from "./surfsup-map-record";

//TODO maybe make a GeoJSON.Feature<GeoJSON.Point> of this.... that would be 
// more generic.
export interface SurfsupMapPoint {
    id: string;
    location: L.LatLng;
    data: SurfsupMapData;
}

export interface SurfsupMapData {
    quantity: SurfsupMapRecord;
    direction?: SurfsupMapRecord;
    label?: SurfsupMapRecord;
}
