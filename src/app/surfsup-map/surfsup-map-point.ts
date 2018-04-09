import * as L from 'leaflet';
import * as proj4x from 'proj4';
import { SurfsupMapSymbology } from "./surfsup-map-symbology";
import { SurfsupMapRecordGroup } from "./surfsup-map-record-group";
import * as SurfsupMapIcon from "./surfsup-map-icon";

interface SurfsupMapMarkerOptions {
    point: SurfsupMapPoint;
    paneId?: string;
    symbology: SurfsupMapSymbology;
}

interface SurfsupMapPointProperties {
    locationCode: string;
    name: string;
    group: string;
    data: SurfsupMapRecordGroup;
}

export class SurfsupMapPoint implements GeoJSON.Feature<GeoJSON.Point> {
    type: "Feature" = "Feature";
	geometry: GeoJSON.Point = {
		type: "Point",
		coordinates: []
    };

    // workaround for proj4 in webpack and typescript; it would give proj4 is not a function error otherwise.
    private proj4 = (proj4x as any).default;
    
	constructor(public properties: SurfsupMapPointProperties, coordinates: {x: number, y: number}, crs: string) {
        this.setGeometry(coordinates, crs);
    }
   
    private setGeometry(coordinatesFrom: {x: number, y: number}, crsFrom: string) {
        const coords = this.proj4("+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", [coordinatesFrom.x, coordinatesFrom.y]);
        this.geometry.crs = {"type": "name", "properties": {"name":  "EPSG:4326"}}
        this.geometry.coordinates = coords;
    }
    
    private latLng() {
        return L.latLng([this.geometry.coordinates[1], this.geometry.coordinates[0]])
    }

    marker(symbology: SurfsupMapSymbology, paneId?: string) {
        const icon = this.icon(symbology);
        const markerOptions: L.MarkerOptions = { icon: icon, pane: paneId  };
        const marker = L.marker(this.latLng(), markerOptions);
        return marker;
    }

    private icon(symbology: SurfsupMapSymbology) {

        const icon = SurfsupMapIcon.get({
            data: this.properties.data,
            symbologyOptions: symbology
        });
        return icon;
    }
}

