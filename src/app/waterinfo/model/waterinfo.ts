export interface WaterinfoLatestMeasurement {
    latestValue: number;
    dateTime: Date;
    unitCode: string;
    parameterId: string;
}

export interface WaterinfoProperties {
    name: string;
    measurements: WaterinfoLatestMeasurement[];
    locationCode: number;
    featured: boolean;
}

export interface WaterinfoPoint extends GeoJSON.Point {
    properties: WaterinfoProperties
}

export interface WaterinfoLatest {
    parameter: WaterinfoParameter;
    features: GeoJSON.Feature<WaterinfoPoint>[];
}

export interface WaterinfoGroup {
    label: string;
    defaultFavorite: boolean;
    slug: string;
    parameters: WaterinfoParameter[];
}

export interface WaterinfoParameter {
    label: string;
    slug: string;
    synonyms: any[];
}

export interface WaterinfoMatDataSource {
	locationName: string,
	locationCode: number,
	parameterName: string,
	parameterId: string,
	group?: string,
	datetime: Date,
	value: number,
	unit: string,
}