import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MapMainService {
    public map: L.Map;
    public baseMaps: L.Control.LayersObject;


  constructor() { 
    this.baseMaps = {
          OpenStreetMap: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            opacity: 1
        }),
        Esri: L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        })
    }

  
  }

  setMap(divId: string) {
    // Note that we can't set the map itself yet when constructing/initializing this service.  
    // The dom is not ready yet, so call this from a component's 'ngOnInit()'. Something like:
    // this.mapMainService.setMap("map-main");   
    const map = L.map(divId, {
        zoomControl: false,
        center: L.latLng(54, 5),
        zoom: 6,
        layers: [this.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.layers(this.baseMaps).addTo(map);
    //L.control.scale().addTo(map);

    this.map = map;

  }
   
}
