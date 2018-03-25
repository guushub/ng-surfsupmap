
export interface WaterInfoRecord {
        location: L.LatLngExpression;
        value: number;
        direction: number;
}


interface IRwsLocation {
    lat: string;
    lon: string;
}

interface IRwsIcon {
}

export interface IRwsFeature {
    locatienaam: string;
    parameternaam: string;
    par: string;
    loc: string;
    net: string;
    waarde: string;
    eenheid: string;
    category: number;
    iconnr: number;
    popupsize: string;
    graphsize: string;
    waardeh10a?: any;
    waardeh10v?: any;
    waardeq10v?: any;
    iconsubscript: string;
    meettijd: string;
    link_wn?: any;
    ids: string[];
    location: IRwsLocation;
    categoryDescription: string;
    icon: IRwsIcon;
}

interface IRwsDataResponse {
    features: IRwsFeature[];
}
