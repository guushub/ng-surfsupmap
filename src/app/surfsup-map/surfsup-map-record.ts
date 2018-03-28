import { SurfsupMapParameter } from "./surfsup-map-parameter";

export interface SurfsupMapRecord {
    datetime: Date;
    value: number;
    parameter: SurfsupMapParameter;
}