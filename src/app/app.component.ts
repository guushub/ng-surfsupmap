import { Component } from '@angular/core';
import * as L from 'leaflet';

// components
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

// services
import { MapMainService } from './services/map/map-main.service';
import { WaterinfoOldService } from './services/waterinfo/waterinfo-old.service';
import { WaterinfoService } from './services/waterinfo/waterinfo.service';
import { LayerWaterinfoService } from './services/layer/layer-waterinfo.service';

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
  
  constructor (private mapMainService: MapMainService, 
    private waterInfoOldService: WaterinfoOldService,
    private waterInfoService: WaterinfoService,
private waterInfoLayerService: LayerWaterinfoService) {

  }

  ngOnInit() {
    // Div should be ready, so now we can finally construct the map.
    this.waterInfoService.getLatest("Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm")
    .subscribe((data) => {
        console.log(data);
    }, (err) => {
        console.log(err);
    });

    this.mapMainService.setMap("map-main");

    const wavesSymbology = Symbology.getSymbologyByTheme(
        Symbology.ThemeType.cm, 
        Symbology.ThemeColor.purple
    )   

    const windSymbology = Symbology.getSymbologyByTheme(
        Symbology.ThemeType["m/s"], 
        Symbology.ThemeColor.orange
    )   

    
    this.waterInfoOldService.getWaterInfoRecords()
        .then(waterInfoRecords => {
            let waveMarkers: L.Marker[] = [];
            let windMarkers: L.Marker[] = [];
            
            waterInfoRecords.waves.forEach((record, i) => { 
                if(!isNaN(record.value) && !isNaN(record.direction)) {
                    const waveMarker = WaterInfoMarker.get(`wave-marker-${i}`, record, "waveMarkers", wavesSymbology, "waves");
                    waveMarkers.push(waveMarker);
                    //waveMarker.addTo(this.mapMainService.map);
                    // testMarker.bindPopup("Hallo");
                }
            });

            waterInfoRecords.wind.forEach((record, i) => { 
                if(!isNaN(record.value) && !isNaN(record.direction)) {
                    record.value = parseFloat(record.value.toFixed(1));
                    const windMarker = WaterInfoMarker.get(`wind-marker-${i}`, record, "windMarkers", windSymbology, "wind");
                    windMarkers.push(windMarker);
                    //windMarker.addTo(this.mapMainService.map);
                    //testMarker.bindPopup("Hallo");
                }
            });

            //this.mapMainService.addLayer("waves", "Golfhoogte (cm)", 610, waveMarkers, wavesSymbology);
            //this.mapMainService.addLayer("wind", "Wind snelheid (m/s)", 605, windMarkers, windSymbology);
            
            this.waterInfoLayerService.addLayer(windMarkers, windSymbology, "Wind snelheid (m/s)");
            this.waterInfoLayerService.addLayer(waveMarkers, wavesSymbology, "Golfhoogte (cm)");

        });

  }

}
