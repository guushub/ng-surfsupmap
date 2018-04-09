import { SurfsupMapSymbology } from "./surfsup-map-symbology";

export const getSymbologyByTheme = (themeType: ThemeType, themeColor?: ThemeColor) => {
    const getIconSize = getThemeIconSize(themeType);
    const font: ThemeFontSettings = getThemeFont(themeType);
    const colors: ThemeColorSettings = getThemeColors(themeColor);
    const symbology: SurfsupMapSymbology = {
        getIconSize: getIconSize,
        borderColor: colors.borderColor,
        fillColor: colors.fillColor,
        labelFontSize: font.labelFontSize,
        labelFontFamily: font.labelFontFamily
    }

    return symbology;
}

const getThemeIconSize = (themeType: ThemeType) => {
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

const getThemeColors = (themeColor: ThemeColor): ThemeColorSettings => {
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

const getThemeFont = (themeType: ThemeType): ThemeFontSettings => {
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
    return size > 100 ? 100 : size;
}

const getIconSizeCm = (x: number) => { 
    const size = 35 + Math.pow(x / 25, 2);
    return size > 120 ? 120 : size;
}

const getIconSizeS = (x: number) => {
    const size = 25 + Math.pow(x, 2);
    return size > 100 ? 100 : size;
}