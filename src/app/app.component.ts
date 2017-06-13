import { Component } from '@angular/core';

// components
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

// services
import { MapMainService } from './services/map/map-main.service';
import { WaterinfoOldService } from './services/waterinfo/waterinfo-old.service';

// Stuff
//import * as WaterInfoMarker from './map-elements/marker/water-info-marker/water-info-marker';
import * as WaterInfoMarker from './map-elements/map-content/water-info-old/water-info-marker';
import * as WaterInfoIcon from './map-elements/map-content/water-info-old/water-info-icon';
import * as Symbology from './map-elements/symbology/symbology';
import { MapPane } from './map-elements/map-pane/map-pane';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor (private mapMainService: MapMainService, private waterInfoOldService: WaterinfoOldService) {

  }

  ngOnInit() {
    // Div should be ready, so now we can finally construct the map.
    this.mapMainService.setMap("map-main");

    const wavesPane = new MapPane("wavesPane", 610);
    wavesPane.add(this.mapMainService.map);

    const windPane = new MapPane("windPane", 605);
    windPane.add(this.mapMainService.map);

    const wavesSymbology: Symbology.IWaterInfoSymbologyCalculated = {
      getIconSize: (x) => { 
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
      },
      borderColor: "#b5a7ee",
      fillColor: "#ffffff",
      labelFontFamily: "Verdana",
      labelFontSize: "0.9em"
    }

    const windSymbology: Symbology.IWaterInfoSymbologyCalculated = {
      getIconSize: (x) => { 
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
      },
      borderColor: "#ffa461",
      fillColor: "#ffffff",
      labelFontFamily: "Verdana",
      labelFontSize: "0.8em"
    }    

    const waveIconLegend = WaterInfoIcon.get({
        id: `wave-marker-legend`,
        value: 92,
        label: "92",
        direction: 270,
        className: "waveMarkers-marker",
        symbologyOptions: wavesSymbology
    });
    const layerDescriptionWave = `${waveIconLegend.options.html} Golfhoogte (cm)`;

    const windIconLegend = WaterInfoIcon.get({
        id: `wind-marker-legend`,
        value: 5.5,
        label: "5.5",
        direction: 270,
        className: "windMarkers-marker",
        symbologyOptions: windSymbology
    });
    const layerDescriptionWind = `${windIconLegend.options.html} Wind snelheid (m/s)`;

    this.waterInfoOldService.getWaterInfoRecords()
    .then(waterInfoRecords => {
        let waveMarkers: L.Marker[] = [];
        let windMarkers: L.Marker[] = [];
        
        waterInfoRecords.waves.forEach((record, i) => { 
            if(!isNaN(record.value) && !isNaN(record.direction)) {
                const waveMarker = WaterInfoMarker.get(`wave-marker-${i}`, record, "waveMarkers", wavesSymbology, wavesPane);
                waveMarkers.push(waveMarker);
                //waveMarker.addTo(this.mapMainService.map);
                // testMarker.bindPopup("Hallo");
            }
        });

        waterInfoRecords.wind.forEach((record, i) => { 
            if(!isNaN(record.value) && !isNaN(record.direction)) {
                record.value = parseFloat(record.value.toFixed(1));
                const windMarker = WaterInfoMarker.get(`wind-marker-${i}`, record, "windMarkers", windSymbology, windPane);
                windMarkers.push(windMarker);
                //windMarker.addTo(this.mapMainService.map);
                //testMarker.bindPopup("Hallo");
            }
        });

        const waveLayer = L.layerGroup(waveMarkers);
        waveLayer.addTo(this.mapMainService.map);

        const windLayer = L.layerGroup(windMarkers);
        windLayer.addTo(this.mapMainService.map);

        let mapOverlays = {};
        mapOverlays[layerDescriptionWave] = waveLayer;
        mapOverlays[layerDescriptionWind] = windLayer;

        L.control.layers({}, mapOverlays).addTo(this.mapMainService.map);

    });

  }

}
