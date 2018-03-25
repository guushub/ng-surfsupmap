import { WaterinfoMeasurementGroup } from "./waterinfo-measurement-group";

export interface WaterinfoStation {
    name: string;
    slug: number;
    latlng: L.LatLng;
    latestValue?: WaterinfoMeasurementGroup;
    values?: WaterinfoMeasurementGroup[];
}