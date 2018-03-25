import { WaterinfoMeasurement } from "./waterinfo-measurement";

export interface WaterinfoMeasurementGroup {
    quantity: WaterinfoMeasurement;
    direction?: WaterinfoMeasurement;
    label?: WaterinfoMeasurement;
}
