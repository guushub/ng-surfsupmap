import { Marker, LatLngExpression } from 'leaflet';

import { WaterInfoIcon } from './water-info-icon';
import { MapPane } from '../../map-pane/map-pane';


export interface IWaterInfoRecord {
        location: LatLngExpression;
        value: number;
        direction: number;
}

export class WaterInfoMarker extends Marker {
        // private _data: IWaterInfoRecord;
        // private _dataGroup: string;
        // private _mapPane: MapPane;

        constructor(public id: string, data: IWaterInfoRecord, dataGroup: string, mapPane?: MapPane) {
                super(data.location);
                // this._data = data;
                // this._dataGroup = dataGroup;
                // this._mapPane = mapPane;

                const icon = new WaterInfoIcon(`${id}-icon`, this._getIconSize(), data.direction, data.value.toString(), `${dataGroup}-marker`);
                const options = mapPane ? { icon: icon, pane: mapPane.paneName } : { icon: icon };

                this.options = options;

                //L.latLng(this._feature.geometry.coordinates[1], this._feature.geometry.coordinates[0]), options).bindPopup(this._getPopup()
        }

        private _getIconSize(nSteps = 1) {
                return 62;
        }

}
