
interface ISymbologyClassifiedOptions {
    min: number;
    max: number;
    nClasses: number;
}

interface ISymbologyCalculatedOptions {
    getIconSize: {(val: number) : number}
}

export interface IWaterInfoSymbology extends ISymbologyClassifiedOptions {
    borderColor: string;
    fillColor: string;
    labelFontFamily: string;
    labelFontSize: string;
}

export interface IWaterInfoSymbologyCalculated extends ISymbologyCalculatedOptions {
    borderColor: string;
    fillColor: string;
    labelFontFamily: string;
    labelFontSize: string;
}



