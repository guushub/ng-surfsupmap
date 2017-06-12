import { Component } from '@angular/core';

// components
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

// services
import { MapMainService } from './services/map/map-main.service';
import { WaterinfoOldService } from './services/waterinfo/waterinfo-old.service';

// Stuff
//import * as WaterInfoMarker from './map-elements/marker/water-info-marker/water-info-marker';
import * as WaterInfoMarker from './map-elements/map-content/water-info-old/water-info-marker';
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

    const testPane = new MapPane("testMarkers", 610);
    testPane.add(this.mapMainService.map);

    const testSymbology: Symbology.ISymbologyClassifiedOptions = {
      min: 0,
      max: 400,
      nClasses: 11
    }

    this.waterInfoOldService.getWaterInfoRecords()
    .then(waterInfoRecords => {
      waterInfoRecords.forEach((record, i) => { 


        const testMarker = WaterInfoMarker.get(`marker-${i}`, record, "testMarkers", testSymbology);
        testMarker.addTo(this.mapMainService.map);
        testMarker.bindPopup("Hallo");

      });

    });

    

    
        // const testData: WaterInfoOld.IWaterInfoRecord = {
        //   direction: 270,
        //   value: 140,
        //   location: L.latLng(54, 5)
        // }
    
    //werkt nog niet:
    //testMarker.bindPopup("<p>Hallo</p>").openPopup();



  }

}
