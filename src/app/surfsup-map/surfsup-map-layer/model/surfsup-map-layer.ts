import { SurfsupMapData } from "../../surfsup-map-data/model/surfsup-map-data";
import { SurfsupMapIconProperties } from "../../surfsup-map-icon/service/surfsup-map-icon.service";

export interface SurfsupMapLocation {
    id: string;
    name: string;
    latLng: L.LatLng;
    quantityData: SurfsupMapData;
    directionData: SurfsupMapData;
    labelData: SurfsupMapData;
	attribution: {
		url: string;
		text: string;
	}
	
}

export class SurfsupMapLayer {
	layerId?: number;
    iconProperties: SurfsupMapIconProperties;
    legendText: string;

    constructor(public locations: SurfsupMapLocation[], themeType?: ThemeType, themeColor?: ThemeColor, legendText?: string) {
        this.iconProperties = this.getSurfsupMapIconProperties(themeType, themeColor);
        this.setLegendText(legendText);
    }

    private setLegendText(legendText) {
        if(legendText) {
            this.legendText = legendText;
            return;
        }

        if(!this.locations || this.locations.length <=0) {
            this.legendText = "";
            return;
        }

        this.legendText = this.locations[0].quantityData.parameter.name;
    }

    private getSurfsupMapIconProperties(themeType: ThemeType, themeColor?: ThemeColor) {
		const getIconSize = this.getThemeIconSize(themeType);
		const font: ThemeFontSettings = this.getThemeFont(themeType);
		const colors: ThemeColorSettings = this.getThemeColors(themeColor);
		const properties: SurfsupMapIconProperties = {
			getIconSize: getIconSize,
			borderColor: colors.borderColor,
			fillColor: colors.fillColor,
			labelFontSize: font.labelFontSize,
			labelFontFamily: font.labelFontFamily
		}
	
		return properties;
	}
	
	private getThemeIconSize(themeType: ThemeType) {
		switch (themeType) {
			case ThemeType.cm:
				return getIconSizeCm;
			case ThemeType["m/s"]:
				return getIconSizeMs;
			case ThemeType.s:
				return getIconSizeS;
			default:
				return getIconSizeCm;
		}
	}
	
	private getThemeColors (themeColor: ThemeColor): ThemeColorSettings {
		switch (themeColor) {
			case ThemeColor.purple:
				return {
					borderColor: "#b5a7ee",
					fillColor: "#ffffff"
				}
			case ThemeColor.orange:
				return { 
					borderColor: "#ffa461",
					fillColor: "#ffffff"
				}
				
			case ThemeColor.darkblue:
				return { 
					borderColor: "#154273",
					fillColor: "#ffffff"
				}
			default:
				return {
					borderColor:  "#000000".replace(/0/g,() => (~~(Math.random()*16)).toString(16)),
					fillColor: "#ffffff"
				}   
		}
		
	}
	
	private getThemeFont(themeType: ThemeType): ThemeFontSettings {
		switch (themeType) {
			case ThemeType.cm:
				return {
					labelFontFamily: "Verdana",
					labelFontSize: "0.9em"
				}
			case ThemeType["m/s"]:
				return { 
					labelFontFamily: "Verdana",
					labelFontSize: "0.8em"
				}
			default:
				return { 
					labelFontFamily: "Verdana",
					labelFontSize: "0.8em"
				}
		}
		
	}
}


export enum ThemeType {
    "cm",
    "m/s",
    "s"
}

export enum ThemeColor {
    "purple",
    "orange",
    "darkblue"
}

interface ThemeFontSettings {
    labelFontFamily: string;
    labelFontSize: string;
}

interface ThemeColorSettings {
    borderColor: string;
    fillColor: string;
}

const getIconSizeMs = (x: number) => { 
    const size = 30 + x * 3;
    return size > 75 ? 75 : size;
}

const getIconSizeCm = (x: number) => { 
    const size = 35 + Math.pow(x / 25, 2);
    return size > 75 ? 75 : size;
}

const getIconSizeS = (x: number) => {
    const size = 25 + Math.pow(x, 2);
    return size > 75 ? 75 : size;
}