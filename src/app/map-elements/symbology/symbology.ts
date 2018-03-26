
interface SymbologyClassifiedOptions {
    min: number;
    max: number;
    nClasses: number;
}

interface SymbologyCalculatedOptions {
    getIconSize: {(val: number) : number};
    legendIconValue: number;
}

export interface WaterInfoSymbology extends SymbologyClassifiedOptions {
    borderColor: string;
    fillColor: string;
    labelFontFamily: string;
    labelFontSize: string;
}

export interface WaterInfoSymbologyCalculated extends SymbologyCalculatedOptions {
    borderColor: string;
    fillColor: string;
    labelFontFamily: string;
    labelFontSize: string;
}

export const getSymbologyByTheme = (themeType: ThemeType, themeColor: ThemeColor) => {
    const getIconSize = getThemeIconSize(themeType);
    const font: ThemeFontSettings = getThemeFont(themeType);
    const colors: ThemeColorSettings = getThemeColors(themeColor);
    const symbology: WaterInfoSymbologyCalculated = {
        getIconSize: getIconSize,
        borderColor: colors.borderColor,
        fillColor: colors.fillColor,
        labelFontSize: font.labelFontSize,
        labelFontFamily: font.labelFontFamily,
        legendIconValue: getThemeLegendIconValue(themeType)
    }

    return symbology;
}


const getThemeIconSize = (themeType: ThemeType) => {
    switch (themeType) {
        case ThemeType.cm:
            return getIconSizeCm;
        case ThemeType["m/s"]:
            return getIconSizeMs;
        default:
            return getIconSizeMs;
    }
}

const getThemeLegendIconValue = (themeType: ThemeType) => {
    switch (themeType) {
        case ThemeType.cm:
            return 92;
        case ThemeType["m/s"]:
            return 5.5;
        default:
            return 5;
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
        default:
            return {
                borderColor: "#ffa461",
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
    "orange"
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
    // bron: https://nl.wikipedia.org/wiki/Schaal_van_Beaufort
    if (x <= 0.2) {
        // Bft 0
        return 10;

    } else if (x > 0.2 && x <= 1.5) {
        // Bft 1
        return 20;

    } else if (x > 1.5 && x <= 3.3) {
        // Bft 2
        return 25;

    } else if (x > 3.3 && x <= 5.4) {
        // Bft 3
        return 35;

    } else if (x > 5.4 && x <= 7.9) {
        // Bft 4
        return 45;

    } else if (x > 7.9 && x <= 10.7) {
        // Bft 5
        return 58;

    } else if (x > 10.7 && x <= 13.8) {
        // Bft 6
        return 65;

    } else if (x > 13.8 && x <= 17.1) {
        // Bft 7
        return 75;

    } else if (x > 17.1 && x <= 20.7) {
        // Bft 8
        return 85;

    } else if (x > 20.7 && x <= 24.4) {
        // Bft 9
        return 95;

    } else if (x > 24.4 && x <= 28.4) {
        // Bft 10
        return 100;

    } else if (x > 28.4 && x <= 32.6) {
        // Bft 11
        return 105;

    } else if (x > 32.6) {
        // Bft 12
        return 110;
    }
    return 2;
}

const getIconSizeCm = (x: number) => { 
    if (x <= 30) {
        // Flat
        return 20;

    } else if (x > 30 && x <= 49) {
        // Knee high
        return 30;

    } else if (x > 49 && x <= 75) {
        // Waist- high
        return 35;

    } else if (x > 75 && x <= 91) {
        // Waist + high
        return 40;

    } else if (x > 91 && x <= 122) {
        // Shoulder high
        return 47;

    } else if (x > 122 && x <= 152) {
        // Head high
        return 62;

    } else if (x > 152 && x <= 183) {
        // 1 foot Overhead
        return 70;
        //return 70;

    } else if (x > 183 && x <= 244) {
        // 3 foot Overhead
        return 75;
        //return 80;

    } else if (x > 244 && x <= 305) {
        // Double overhead
        return 80;
        //return 100;

    } else if (x > 305 && x <= 400) {
        // Double overhad +
        return 85;
        //return 110;

    } else if (x > 400) {
        // Massive
        return 90;
        //return 120;
    }

    return 5;
}