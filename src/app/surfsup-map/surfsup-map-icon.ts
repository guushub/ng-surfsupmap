import * as L from 'leaflet';

import { SurfsupMapSymbology } from "./surfsup-map-symbology";
import { SurfsupMapRecordGroup } from './surfsup-map-record-group';
import { SurfsupMapRecord } from './surfsup-map-record';

export const get = (options: SurfsupMapIconOptions, isLegendSymbol = false) => {
    let quantityValue: number;
    let iconSize = 30;
    let directionValue = 270;
    let labelValue: number;
    let labelText = "";
    const idMarkerArrow = `${options.symbologyOptions.fillColor}${options.symbologyOptions.borderColor}`.replace("#","");

    if(!isLegendSymbol) {
        quantityValue = options.data.quantity.value;
        iconSize = options.symbologyOptions.getIconSize(quantityValue);
        directionValue = options.data.direction ? options.data.direction.value : NaN;
        labelValue = options.data.label ? options.data.label.value : NaN;

        if(labelValue) {
            const unit = options.data.label.parameter ? options.data.label.parameter.unit : "";
            if(unit === "m/s" || unit === "s") {
                labelText = labelValue.toFixed(1);
            } else {
                labelText = labelValue.toFixed(0);
            }
        }
    }

    const html = generateHtml(
        iconSize, directionValue, labelText, idMarkerArrow, 
        options.symbologyOptions.fillColor, options.symbologyOptions.borderColor, 
        options.symbologyOptions.labelFontFamily, options.symbologyOptions.labelFontSize
    );

    const divIconOptions: L.DivIconOptions = {
        className: "surfsupmap-icon",
        iconSize: L.point(iconSize, iconSize),
        html: html
    }
    const divIcon = L.divIcon(divIconOptions);
    return divIcon;
}

export interface SurfsupMapIconOptions {
    data: SurfsupMapRecordGroup;
    symbologyOptions: SurfsupMapSymbology;
}

const generateHtml = (iconSize: number, directionValue: number, labelText: string, idMarkerArrow: string, fillColor: string, borderColor: string, fontFamily: string, fontSize: string) => {
    const circleRadius = getCircleRadius(iconSize);

    let polylineHtml = ""
    if(directionValue) {
        polylineHtml = `<polyline r='${circleRadius}' stroke-width='${circleRadius / 3}' marker-end='url(#${idMarkerArrow})' points='${getPolylinePoints(iconSize, directionValue)}'></polyline>`
    }

    const html = `<svg width=${iconSize} height=${iconSize}>
                    <defs>
                        ${getDef(iconSize, idMarkerArrow, borderColor)}
                    </defs>
                <circle r='${circleRadius/* + 0.8*/}' cx='${iconSize / 2}' cy='${iconSize / 2}' 
                style='stroke-width: ${circleRadius / 5};
                fill: ${fillColor};
                stroke: ${borderColor};'></circle>
                    <text text-anchor='middle' dy='0.3em' x='${iconSize / 2}' y='${iconSize / 2}' 
                    style='/*font-family: ${fontFamily};
                    font-size: ${fontSize};*/
                    fill: ${borderColor};'>${labelText}</text>
                    ${polylineHtml}
                </svg>`;

    return html;
}

const getDef = (iconSize: number, idMarkerArrow: string, color: string) => {  
    const circleRadius = getCircleRadius(iconSize);
    const defs = `<marker id='${idMarkerArrow}' markerWidth='${circleRadius}' markerHeight='${circleRadius}' refX='0' refY='3' orient='auto' 
    markerUnits='strokeWidth' style='fill: ${color};'>
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