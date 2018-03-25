import { WaterinfoParameter } from "./waterinfo-parameter";

export interface WaterinfoMeasurement {
    datetime: Date;
    value: number;
    parameter: WaterinfoParameter;
}