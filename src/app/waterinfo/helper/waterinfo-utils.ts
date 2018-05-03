import * as L from 'leaflet';
// workaround for proj4 in webpack and typescript; it would give proj4 is not a function error otherwise.
import * as proj4x from 'proj4';
const proj4 = (proj4x as any).default;

import * as Waterinfo from "../model/waterinfo";
import { SurfsupMapData, SurfsupMapParameter } from "../../surfsup-map/surfsup-map-data/model/surfsup-map-data";
import { SurfsupMapLocation, SurfsupMapLayer, ThemeType, ThemeColor } from "../../surfsup-map/surfsup-map-layer/model/surfsup-map-layer";


export interface WaterinfoSurfsupMapInput {
    locationCode: string;
    locationName: string;
    coordinates: {x: number, y: number}, group: string;
    quantityData: { measurement: Waterinfo.WaterinfoLatestMeasurement, parameter: Waterinfo.WaterinfoParameter },
    directionData?: { measurement: Waterinfo.WaterinfoLatestMeasurement, parameter: Waterinfo.WaterinfoParameter }, 
    labelData?: { measurement: Waterinfo.WaterinfoLatestMeasurement, parameter: Waterinfo.WaterinfoParameter }
}

export class WaterinfoUtils {

    public static latestMeasurementToSurfsupMapData(measurement: Waterinfo.WaterinfoLatestMeasurement, parameter: Waterinfo.WaterinfoParameter): SurfsupMapData {
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

    public static getSurfsupMapLocation(input: WaterinfoSurfsupMapInput): SurfsupMapLocation {
        
        const latLng = proj4("+proj=utm +zone=31 +ellps=GRS80 +units=m +no_defs", "EPSG:4326", [input.coordinates.x, input.coordinates.y]);
        const leafletLatLng = L.latLng([latLng[1], latLng[0]])

        const parameters: string[] = [input.quantityData.parameter.slug];
        if(input.directionData && parameters.indexOf(input.directionData.parameter.slug) < 0) parameters.push(input.directionData.parameter.slug);
		if(input.labelData && parameters.indexOf(input.labelData.parameter.slug) < 0) parameters.push(input.labelData.parameter.slug);
        const attribution = this.getAttribution(input.locationCode, input.group, parameters);

        const quantitySurfsupMap = this.latestMeasurementToSurfsupMapData(input.quantityData.measurement, input.quantityData.parameter);
        const directionSurfsupMap = input.directionData ? this.latestMeasurementToSurfsupMapData(input.directionData.measurement, input.directionData.parameter) : null;
        const labelSurfsupMap = input.labelData ? this.latestMeasurementToSurfsupMapData(input.labelData.measurement, input.labelData.parameter) : null;

        const location: SurfsupMapLocation = {
            quantityData: quantitySurfsupMap,
            directionData: directionSurfsupMap,
            labelData: labelSurfsupMap,
            id: input.locationCode,
            name: input.locationName,
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
    
    public static featureCollectionToWaterinfoSurfsupMapInputs(group: string, featureCollection: GeoJSON.FeatureCollection<Waterinfo.WaterinfoPoint>, parameterQuantity: Waterinfo.WaterinfoParameter, parameterDirection: Waterinfo.WaterinfoParameter, parameterLabel: Waterinfo.WaterinfoParameter) {
        const dataInput: WaterinfoSurfsupMapInput[] = [];
		const features = featureCollection.features;

		features.forEach((feature) => {
			const properties = feature.properties as Waterinfo.WaterinfoProperties;
			if(parameterQuantity && properties.measurements.length > 0 && properties.measurements[0].parameterId === parameterQuantity.slug && this.latestMeasurementIsValid(properties.measurements[0])) {
				const nMeasurements = properties.measurements.length;
				const quantityData = {
					measurement: properties.measurements[0],
					parameter: parameterQuantity
				}

				// TODO check if measurement exists.
				let directionData;
				if(parameterDirection && properties.measurements.length > 1 && properties.measurements[1].parameterId === parameterDirection.slug) {
					const measurement = properties.measurements[1];
					const val = this.latestMeasurementIsValid(measurement) ? measurement : NaN;

					directionData = {
						measurement: val,
						parameter: parameterDirection
					}
				}

				let labelData;
				if(parameterLabel && properties.measurements.length > 1 && properties.measurements[nMeasurements - 1].parameterId === parameterLabel.slug) {
					const measurement = properties.measurements[nMeasurements - 1];
					const val = this.latestMeasurementIsValid(measurement) ? measurement : NaN;

					labelData = {
						measurement: val,
						parameter: parameterLabel
					}
				}

				const input: WaterinfoSurfsupMapInput = {
					locationCode: properties.locationCode.toString(),
					locationName: properties.name,
					group: group,
					coordinates: { x: feature.geometry.coordinates[0], y: feature.geometry.coordinates[1]},
					quantityData: quantityData,
					directionData: directionData,
					labelData: labelData
				}

				dataInput.push(input);
			}

        });
        return dataInput;
    }

    public static getSurfsupMapLayer(inputs: WaterinfoSurfsupMapInput[], isPreset: boolean) {
		if(!inputs || inputs.length <= 0) {
			return null;
		}
		const quantitySlug = inputs[0].quantityData.parameter.slug;

		const themeType = this.getThemeTypeFromSlug(quantitySlug);
		let themeColor: ThemeColor;
		if(isPreset) {
			themeColor = this.getPresetThemeColorFromSlug(quantitySlug);
		}

        const surfsupMapLocations = inputs.map(input => this.getSurfsupMapLocation(input));
        const layer = new SurfsupMapLayer(surfsupMapLocations, themeType, themeColor);
        return layer;
    }

    public static getUnitFromSlug(slug: string) {
		const splitted = slug.split("___20");
		const unit = splitted ? splitted[splitted.length - 1] : "";
		return unit;
    }
    
    public static getThemeTypeFromSlug(slug: string) {
		const unit = this.getUnitFromSlug(slug);
		switch (unit) {
			case "cm":
				return ThemeType.cm;
			case "m/s":
				return ThemeType["m/s"];
			case "m___2Fs":
				return ThemeType["m/s"];
			case "s":
				return ThemeType.s;
			default:
				return ThemeType.cm;
		}
    }
    
    public static getPresetThemeColorFromSlug(slug: string) {
		switch (slug) {
			case "Windsnelheid___20Lucht___20t.o.v.___20Mean___20Sea___20Level___20in___20m___2Fs":
				return ThemeColor.orange;
			case "Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm":
				return ThemeColor.purple;
			case "Significante___20deiningshoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20cm":
				return ThemeColor.darkblue;
			default:
				return;
		}
	}

	public static latestMeasurementIsValid(measurement: Waterinfo.WaterinfoLatestMeasurement): boolean {
        if(!measurement.latestValue || measurement.latestValue > 9999) {
            return false;
        }

        const unit = this.getUnitFromSlug(measurement.parameterId);
        switch (unit) {
            case "graad":
                if(measurement.latestValue > 360) {
                    return false;
                }
                break;
            default:
                break;
        }

        if (new Date().getTime() - new Date(measurement.dateTime).getTime() > 3600000) {
            return false;
        }

        return true;
    }

}