import * as L from 'leaflet';
import * as _ from 'lodash';

import { ISymbologyClassifiedOptions } from '../../symbology/symbology';

export const get = (waterInfoIconOptions: IWaterInfoIconOptions) => {
    const iconSize = _getIconSize(waterInfoIconOptions.value, waterInfoIconOptions.symbologyOptions);
    const options = {
        iconSize: L.point(iconSize, iconSize),
        className: waterInfoIconOptions.className,
        html: _getHtml(waterInfoIconOptions)
    }
    const divIcon = L.divIcon(options) as WaterInfoIcon;
    divIcon.id = waterInfoIconOptions.id;
    return divIcon;
}

export interface IWaterInfoIconOptions {
    id: string; 
    value: number; 
    direction: number; 
    label: string; 
    className: string;
    symbologyOptions: ISymbologyClassifiedOptions;
}

class WaterInfoIcon extends L.DivIcon {
    id?: string;
}

const _getHtml = (waterInfoIconOptions: IWaterInfoIconOptions) => {
    const iconSize = _getIconSize(waterInfoIconOptions.value, waterInfoIconOptions.symbologyOptions);
    const circleRadius = _getCircleRadius(iconSize);
    const direction = waterInfoIconOptions.direction;
    const idMarkerArrow = `arrow-${waterInfoIconOptions.id}`;
    const html = `<svg width=${iconSize} height=${iconSize}>
                    <defs>
                        ${_getDef(iconSize, idMarkerArrow)}
                    </defs>
                    <circle r='${circleRadius/* + 0.8*/}' cx='${iconSize / 2}' cy='${iconSize / 2}' style='stroke-width: ${circleRadius / 5};'></circle>
                    <text text-anchor='middle' dy='0.3em' x='${iconSize / 2}' y='${iconSize / 2}'>${waterInfoIconOptions.label}</text>
                    <polyline r='${circleRadius}' stroke-width='${circleRadius / 3}' marker-end='url(#${idMarkerArrow})' points='${_getPolylinePoints(iconSize, direction)}'></polyline>
                </svg>`;

    return html;
}


const _getDef = (iconSize: number, idMarkerArrow: string) => {  
    const circleRadius = _getCircleRadius(iconSize);
    const defs = `<marker id='${idMarkerArrow}' markerWidth='${circleRadius}' markerHeight='${circleRadius}' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>
        <path d='M0, 0.2 L0.7, 1 L1, 1.5 L1.4, 3 L1, 4.5 L0.7, 5 L0, 5.8 L4, 3 z'></path>
    </marker>`
    return defs;
}

const _getPolylinePoints = (iconSize: number, direction: number) => {
    const cx = iconSize / 2;
    const cy = iconSize / 2;
    const lineLength = _getCircleRadius(iconSize) * 1.2;

    const directionRad = direction * Math.PI / 180;
    const dx = lineLength / 2 * Math.sin(directionRad);
    const dy = lineLength / 2 * Math.cos(directionRad);

    var endPoint = {
        x: cx - dx,
        y: cy + dy
    };

    var startPoint = {
        x: cx + dx,
        y: cy - dy
    };

    return startPoint.x + "," + startPoint.y + " " + endPoint.x + "," + endPoint.y;
}

const _getCircleRadius = (iconSize) => {
    return iconSize / 4;
}

const _getIconSize = (value: number, symbologyOptions: ISymbologyClassifiedOptions) => {
    const minIconSize = 10;
    const maxIconSize = 100;
    
    const stepIconSize = (maxIconSize - minIconSize) / symbologyOptions.nClasses;
    const valStepSize = (symbologyOptions.max - symbologyOptions.min) / symbologyOptions.nClasses;

    const iconSizeRange = _.range(minIconSize, maxIconSize, stepIconSize);
    const valRange = _.range(symbologyOptions.min, symbologyOptions.max, valStepSize);
    
    const valMinClass = valRange.find(x => x >= value);
    const valMinClassIndex = valMinClass ? valRange.indexOf(valMinClass) : valRange.length - 1;

    return iconSizeRange[valMinClassIndex];
}