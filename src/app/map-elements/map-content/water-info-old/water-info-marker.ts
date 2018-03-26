import * as L from 'leaflet';

import * as WaterInfoIcon from './water-info-icon';
import { WaterInfoRecord } from './water-info-record'
import { MapPane } from '../../map-pane/map-pane';
import { WaterInfoSymbologyCalculated } from '../../symbology/symbology';

export const get = (id: string, data: WaterInfoRecord, dataGroup: string,
        symbologyOptions: WaterInfoSymbologyCalculated, paneName: string) => {
        const icon = WaterInfoIcon.get({
                id: `${id}-icon`,
                value: data.value,
                direction: data.direction,
                label: data.value.toString(),
                className: `${dataGroup}-marker`,
                symbologyOptions: symbologyOptions
        });
        const options = paneName ? { icon: icon, pane: paneName } : { icon: icon };
        const marker = L.marker(data.location, options);

        return marker as WaterInfoMarker;
}

class WaterInfoMarker extends L.Marker {
        id?: string;
}