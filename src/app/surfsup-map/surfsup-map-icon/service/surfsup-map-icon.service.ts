import { Injectable } from '@angular/core';
import * as L from 'leaflet';

import { SurfsupMapData } from '../../surfsup-map-data/model/surfsup-map-data';

export interface SurfsupMapIconProperties {
	getIconSize: { (val: number): number };
	borderColor: string;
	fillColor: string;
	labelFontFamily: string;
	labelFontSize: string;
}

@Injectable()
export class SurfsupMapIconService {

	constructor() { }

	getIcon(quantityData: SurfsupMapData, directionData: SurfsupMapData, labelData: SurfsupMapData,
		iconProperties: SurfsupMapIconProperties, isLegendSymbol = false) {
		let quantityValue: number;
		let iconSize = 30;
		let directionValue = 270;
		let labelValue: number;
		let labelText = "";
		const idMarkerArrow = `${iconProperties.fillColor}${iconProperties.borderColor}`.replace("#", "");

		if (!isLegendSymbol) {
			quantityValue = quantityData.value;
			iconSize = iconProperties.getIconSize(quantityValue);
			directionValue = directionData ? directionData.value : NaN;
			labelValue = labelData ? labelData.value : NaN;

			if (labelValue) {
				const unit = labelData.parameter ? labelData.parameter.unit : "";
				if (unit === "m/s" || unit === "s") {
					labelText = labelValue.toFixed(1);
				} else {
					labelText = labelValue.toFixed(0);
				}
			}
		}

		const html = this.generateHtml(
			iconSize, directionValue, labelText, idMarkerArrow,
			iconProperties.fillColor, iconProperties.borderColor,
			iconProperties.labelFontFamily, iconProperties.labelFontSize
		);

		const divIconOptions: L.DivIconOptions = {
			className: "surfsupmap-icon",
			iconSize: L.point(iconSize, iconSize),
			html: html
		}
		const divIcon = L.divIcon(divIconOptions);

		return divIcon;
	}

	getLegendIcon(iconProperties: SurfsupMapIconProperties) {
		return this.getIcon(null, null, null, iconProperties, true);
	}

	private generateHtml(iconSize: number, directionValue: number, labelText: string, idMarkerArrow: string,
		fillColor: string, borderColor: string, fontFamily: string, fontSize: string) {
		const circleRadius = this.getCircleRadius(iconSize);

		let polylineHtml = ""
		if (directionValue) {
			polylineHtml = `<polyline r='${circleRadius}' stroke-width='${circleRadius / 3}' marker-end='url(#${idMarkerArrow})' points='${this.getPolylinePoints(iconSize, directionValue)}'></polyline>`
		}

		const html = `<svg width=${iconSize} height=${iconSize}>
										<defs>
												${this.getDef(iconSize, idMarkerArrow, borderColor)}
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

	private getDef(iconSize: number, idMarkerArrow: string, color: string) {
		const circleRadius = this.getCircleRadius(iconSize);
		const defs = `<marker id='${idMarkerArrow}' markerWidth='${circleRadius}' markerHeight='${circleRadius}' refX='0' refY='3' orient='auto' 
		markerUnits='strokeWidth' style='fill: ${color};'>
				<path d='M0, 0.2 L0.7, 1 L1, 1.5 L1.4, 3 L1, 4.5 L0.7, 5 L0, 5.8 L4, 3 z'></path>
		</marker>`
		return defs;
	}

	private getPolylinePoints(iconSize: number, direction: number) {
		const cx = iconSize / 2;
		const cy = iconSize / 2;
		const lineLength = this.getCircleRadius(iconSize) * 1.2;

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

	private getCircleRadius(iconSize) {
		return iconSize / 4;
	}


}
