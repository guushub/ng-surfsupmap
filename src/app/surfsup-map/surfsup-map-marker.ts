import * as L from 'leaflet';
import { SurfsupMapPoint } from "./surfsup-map-point";
import { SurfsupMapSymbology } from "./surfsup-map-symbology";
import * as SurfsupMapIcon from "./surfsup-map-icon";

export const get = (options: SurfsupMapMarkerOptions) => {
    const icon = SurfsupMapIcon.get({
            data: options.point.data,
            symbologyOptions: options.symbology
    });
    const markerOptions: L.MarkerOptions = { icon: icon, pane: options.paneId };
    const marker = L.marker(options.point.location, markerOptions);

    return marker;
}

// class WaterInfoMarker extends L.Marker {
//     id?: string;
// }

export interface SurfsupMapMarkerOptions {
    point: SurfsupMapPoint;
    paneId: string;
    symbology: SurfsupMapSymbology;
}