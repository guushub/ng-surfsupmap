
export interface SymbologyClassifiedOptions {
    min: number;
    max: number;
    nClasses: number;
}

export interface SymbologyCalculatedOptions {
    getIconSize: {(val: number) : number};
    legendIconValue: number;
}