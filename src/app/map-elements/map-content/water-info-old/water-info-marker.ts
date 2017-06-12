import * as L from 'leaflet';

import * as WaterInfoIcon from './water-info-icon';
import { IWaterInfoRecord } from './water-info-record'
import { MapPane } from '../../map-pane/map-pane';
import { ISymbologyClassifiedOptions } from '../../symbology/symbology';

export const get = (id: string, data: IWaterInfoRecord, dataGroup: string, symbologyOptions: ISymbologyClassifiedOptions, mapPane?: MapPane) => {
        const icon = WaterInfoIcon.get({
                id: `${id}-icon`,
                value: data.value,
                direction: data.direction,
                label: data.value.toString(),
                className: `${dataGroup}-marker`,
                symbologyOptions: symbologyOptions
        });
        const options = mapPane ? { icon: icon, pane: mapPane.paneName } : { icon: icon };
        const marker = L.marker(data.location, options);

        return marker as WaterInfoMarker;
}

class WaterInfoMarker extends L.Marker {
        id?: string;
}