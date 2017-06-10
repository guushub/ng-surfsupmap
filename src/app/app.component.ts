import { Component } from '@angular/core';

// components
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

// services
import { MapMainService } from './services/map/map-main.service';

// Stuff
import { WaterInfoMarker, IWaterInfoRecord } from './map-elements/marker/water-info-marker/water-info-marker';
import { MapPane } from './map-elements/map-pane/map-pane';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor (private mapMainService: MapMainService) {

  }

  ngOnInit() {
    // Div should be ready, so now we can finally construct the map.
    this.mapMainService.setMap("map-main");

    const testPane = new MapPane("testMarkers", 610);
    testPane.add(this.mapMainService.map);

    const testData: IWaterInfoRecord = {
      direction: 270,
      value: 140,
      location: L.latLng(54, 5)
    }

    const testMarker = new WaterInfoMarker("testMarker1", testData, "testMarkers", testPane);

    //werkt nog niet:
    //testMarker.bindPopup("<p>Hallo</p>").openPopup();

    testMarker.addTo(this.mapMainService.map);
  }

}
