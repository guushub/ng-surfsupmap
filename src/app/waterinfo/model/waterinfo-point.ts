import * as L from 'leaflet';
import * as proj4x from 'proj4';
import { SurfsupMapData } from '../../surfsup-map/surfsup-map-data/model/surfsup-map-data';

interface WaterinfoPointProperties {
    locationCode: string;
    name: string;
    group: string;
    data: {
        quantity: SurfsupMapData;
        direction?: SurfsupMapData;
        label?: SurfsupMapData;
    };
}

export class WaterinfoPoint implements GeoJSON.Feature<GeoJSON.Point> {
    type: "Feature" = "Feature";
	geometry: GeoJSON.Point = {
		type: "Point",
		coordinates: []
    };

    // workaround for proj4 in webpack and typescript; it would give proj4 is not a function error otherwise.
    private proj4 = (proj4x as any).default;
    
	constructor(public properties: WaterinfoPointProperties, coordinates: {x: number, y: number}, crs: string) {
        this.setGeometry(coordinates, crs);
    }
   
    private setGeometry(coordinatesFrom: {x: number, y: number}, crsFrom: string) {
        const coords = this.proj4("+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", [coordinatesFrom.x, coordinatesFrom.y]);
        this.geometry.crs = {"type": "name", "properties": {"name":  "EPSG:4326"}}
        this.geometry.coordinates = coords;
    }
    
    latLng() {
        return L.latLng([this.geometry.coordinates[1], this.geometry.coordinates[0]])
    }

}

