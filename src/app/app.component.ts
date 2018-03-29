import { Component } from '@angular/core';
import * as L from 'leaflet';

// components
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

// services for data
import { WaterinfoOldService } from './services/waterinfo/waterinfo-old.service';
import { WaterinfoService } from './services/waterinfo/waterinfo.service';

// services for map control
import { MapMainService } from './services/map/map-main.service';
import { SurfsupLayerMapService } from './services/layer/surfsup-map-layer.service';

// Stuff
// import * as WaterInfoMarker from './map-elements/map-content/water-info-old/water-info-marker';
// import * as WaterInfoIcon from './map-elements/map-content/water-info-old/water-info-icon';
//import * as Symbology from './map-elements/symbology/symbology';
import * as SurfsupMapTheme from "./surfsup-map/surfsup-map-theme";



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
    private surfsupMapLayerService: SurfsupLayerMapService) {

  }

  ngOnInit() {
    // Div should be ready, so now we can finally construct the map.

    this.waterInfoService.getLatest("Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm")
    .subscribe((data) => {
        console.log(data);
    });

    // this.waterInfoService.getWaterinfoStationsLatest(
    //     "Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm",
    //     "Gemiddelde___20golfrichting___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20graad"
    // )
    
    this.waterInfoService.getLatestAsSurfsupMapData(
        "Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm",
        "Gemiddelde___20golfrichting___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20graad",
        "Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm"
    )
    .subscribe((data) => {
        console.log(data);
    });

    this.mapMainService.setMap("map-main");

    // const wavesSymbology = Symbology.getSymbologyByTheme(
    //     Symbology.ThemeType.cm, 
    //     Symbology.ThemeColor.purple
    // )   

    // const windSymbology = Symbology.getSymbologyByTheme(
    //     Symbology.ThemeType["m/s"], 
    //     Symbology.ThemeColor.orange
    // )   

    
    // this.waterInfoOldService.getWaterInfoRecords()
    //     .then(waterInfoRecords => {
    //         let waveMarkers: L.Marker[] = [];
    //         let windMarkers: L.Marker[] = [];
            
    //         waterInfoRecords.waves.forEach((record, i) => { 
    //             if(!isNaN(record.value) && !isNaN(record.direction)) {
    //                 const waveMarker = WaterInfoMarker.get(`wave-marker-${i}`, record, "waveMarkers", wavesSymbology, "waves");
    //                 waveMarkers.push(waveMarker);
    //                 //waveMarker.addTo(this.mapMainService.map);
    //                 // testMarker.bindPopup("Hallo");
    //             }
    //         });

    //         waterInfoRecords.wind.forEach((record, i) => { 
    //             if(!isNaN(record.value) && !isNaN(record.direction)) {
    //                 record.value = parseFloat(record.value.toFixed(1));
    //                 const windMarker = WaterInfoMarker.get(`wind-marker-${i}`, record, "windMarkers", windSymbology, "wind");
    //                 windMarkers.push(windMarker);
    //                 //windMarker.addTo(this.mapMainService.map);
    //                 //testMarker.bindPopup("Hallo");
    //             }
    //         });

    //         //this.mapMainService.addLayer("waves", "Golfhoogte (cm)", 610, waveMarkers, wavesSymbology);
    //         //this.mapMainService.addLayer("wind", "Wind snelheid (m/s)", 605, windMarkers, windSymbology);
            
    //         this.surfsupMapLayerService.addLayer(windMarkers, windSymbology, "Wind snelheid (m/s)");
    //         this.surfsupMapLayerService.addLayer(waveMarkers, wavesSymbology, "Golfhoogte (cm)");

    //     });

  }

}
