export interface SurfsupMapParameter {
    id: string;
    name: string;
    unit: string;
}

export class SurfsupMapData {
    datetime: Date;
    value: number;
    parameter: SurfsupMapParameter;
}

