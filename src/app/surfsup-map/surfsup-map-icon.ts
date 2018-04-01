import * as L from 'leaflet';

import { SurfsupMapSymbology } from "./surfsup-map-symbology";
import { SurfsupMapRecordGroup } from './surfsup-map-record-group';

export const get = (options: SurfsupMapIconOptions) => {
    const quantityValue = options.data.quantity;
    const iconSize = options.symbologyOptions.getIconSize(quantityValue.value);
    const divIconOptions: L.DivIconOptions = {
        className: "surfsupmap-icon",
        iconSize: L.point(iconSize, iconSize),
        html: getHtml(options)
    }
    const divIcon = L.divIcon(divIconOptions);
    return divIcon;
}

export interface SurfsupMapIconOptions {
    data: SurfsupMapRecordGroup;
    symbologyOptions: SurfsupMapSymbology;
}

const getHtml = (options: SurfsupMapIconOptions) => {
    const quantityValue = options.data.quantity.value;
    const directionValue = options.data.direction ? options.data.direction.value : NaN;
    const labelValue = options.data.label ? options.data.label.value : NaN;

    const iconSize = options.symbologyOptions.getIconSize(quantityValue);
    const circleRadius = getCircleRadius(iconSize);
    const idMarkerArrow = `${options.symbologyOptions.fillColor}${options.symbologyOptions.borderColor}`.replace("#","");

    let polylineHtml = ""
    if(directionValue) {
        polylineHtml = `<polyline r='${circleRadius}' stroke-width='${circleRadius / 3}' marker-end='url(#${idMarkerArrow})' points='${getPolylinePoints(iconSize, directionValue)}'></polyline>`
    }

    let label = "";
    if(labelValue) {
        const unit = options.data.label.parameter ? options.data.label.parameter.unit : "";
        if(unit === "m/s" || unit === "s") {
            label = labelValue.toFixed(1);
        } else {
            label = labelValue.toFixed(0);
        }
    }

    const html = `<svg width=${iconSize} height=${iconSize}>
                    <defs>
                        ${getDef(iconSize, idMarkerArrow, options.symbologyOptions)}
                    </defs>
                <circle r='${circleRadius/* + 0.8*/}' cx='${iconSize / 2}' cy='${iconSize / 2}' 
                style='stroke-width: ${circleRadius / 5};
                fill: ${options.symbologyOptions.fillColor};
                stroke: ${options.symbologyOptions.borderColor};'></circle>
                    <text text-anchor='middle' dy='0.3em' x='${iconSize / 2}' y='${iconSize / 2}' 
                    style='font-family: ${options.symbologyOptions.labelFontFamily};
                    font-size: ${options.symbologyOptions.labelFontSize};
                    fill: ${options.symbologyOptions.borderColor};'>${label}</text>
                    ${polylineHtml}
                </svg>`;

    return html;
}


const getDef = (iconSize: number, idMarkerArrow: string, symbologyOptions: SurfsupMapSymbology) => {  
    const circleRadius = getCircleRadius(iconSize);
    const defs = `<marker id='${idMarkerArrow}' markerWidth='${circleRadius}' markerHeight='${circleRadius}' refX='0' refY='3' orient='auto' 
    markerUnits='strokeWidth' style='fill: ${symbologyOptions.borderColor};'>
        <path d='M0, 0.2 L0.7, 1 L1, 1.5 L1.4, 3 L1, 4.5 L0.7, 5 L0, 5.8 L4, 3 z'></path>
    </marker>`
    return defs;
}

const getPolylinePoints = (iconSize: number, direction: number) => {
    const cx = iconSize / 2;
    const cy = iconSize / 2;
    const lineLength = getCircleRadius(iconSize) * 1.2;

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

const getCircleRadius = (iconSize) => {
    return iconSize / 4;
}