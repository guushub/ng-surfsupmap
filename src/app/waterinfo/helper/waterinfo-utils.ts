import * as L from 'leaflet';

// workaround for proj4 in webpack and typescript; it would give proj4 is not a function error otherwise.
import * as proj4x from 'proj4';
const proj4 = (proj4x as any).default;

import { WaterinfoLatest, WaterinfoProperties, WaterinfoLatestMeasurement } from "../service/waterinfo.service";
import { WaterinfoParameter } from "../model/waterinfo-parameter";
import { SurfsupMapData, SurfsupMapParameter } from "../../surfsup-map/surfsup-map-data/model/surfsup-map-data";
import { SurfsupMapLocation } from "../../surfsup-map/surfsup-map-layer/model/surfsup-map-layer";

export interface WaterinfoSurfsupMapInput {
    locationCode: string;
    locationName: string;
    coordinates: {x: number, y: number}, group: string;
    quantityData: { measurement: WaterinfoLatestMeasurement, parameter: WaterinfoParameter },
    directionData?: { measurement: WaterinfoLatestMeasurement, parameter: WaterinfoParameter }, 
    labelData?: { measurement: WaterinfoLatestMeasurement, parameter: WaterinfoParameter }
}

export class WaterinfoUtils {

    public static latestMeasurementToSurfsupMapData(measurement: WaterinfoLatestMeasurement, parameter: WaterinfoParameter): SurfsupMapData {
        const par: SurfsupMapParameter = {
            id: parameter.slug,
            name: parameter.label,
            unit: measurement.unitCode            
        }

        const surfsupMapData: SurfsupMapData = {
            datetime: new Date(measurement.dateTime),
            parameter: par,
            value: measurement.latestValue
        }

        return surfsupMapData;
    }

    public static getSurfsupMapLocation(
        locationCode: string, locationName: string, coordinates: {x: number, y: number}, group: string,
        quantityData: { measurement: WaterinfoLatestMeasurement, parameter: WaterinfoParameter },
        directionData?: { measurement: WaterinfoLatestMeasurement, parameter: WaterinfoParameter }, 
        labelData?: { measurement: WaterinfoLatestMeasurement, parameter: WaterinfoParameter }
    ): SurfsupMapLocation {
        
        const latLng = proj4("+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", [coordinates.x, coordinates.y]);
        const leafletLatLng = L.latLng([latLng[1], latLng[0]])

        const parameters: string[] = [quantityData.parameter.slug];
        if(directionData && parameters.indexOf(directionData.parameter.slug) < 0) parameters.push(directionData.parameter.slug);
		if(labelData && parameters.indexOf(labelData.parameter.slug) < 0) parameters.push(labelData.parameter.slug);
        const attribution = this.getAttribution(locationCode, group, parameters);

        const quantitySurfsupMap = this.latestMeasurementToSurfsupMapData(quantityData.measurement, quantityData.parameter);
        const directionSurfsupMap = directionData ? this.latestMeasurementToSurfsupMapData(directionData.measurement, directionData.parameter) : null;
        const labelSurfsupMap = labelData ? this.latestMeasurementToSurfsupMapData(labelData.measurement, labelData.parameter) : null;

        const location: SurfsupMapLocation = {
            quantityData: quantitySurfsupMap,
            directionData: directionSurfsupMap,
            labelData: labelSurfsupMap,
            id: locationCode,
            name: locationName,
            latLng: leafletLatLng,
            attribution: attribution
        }
        return location;
    }

    public static getAttribution(locationCode: string, group: string, parameters: string[]) {
				
		const waterinfoUrl  = `https://waterinfo.rws.nl/#!/details/expert/${group}/${locationCode}/${parameters.join(",")}`
		const attr = {
			url: waterinfoUrl,
			text: "Bron en grafieken: waterinfo.rws.nl"
			
		}
		return attr;
	}


}