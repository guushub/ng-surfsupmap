import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { WaterInfoSymbologyCalculated } from '../../map-elements/symbology/symbology';

interface WaterinfoLayer {
  name: string;
  layer: L.LayerGroup;
  symbology: WaterInfoSymbologyCalculated;
}

@Injectable()
export class MapMainService {
    public map: L.Map;
    public baseMaps: L.Control.LayersObject;
    private layers: {[layerId: string] : WaterinfoLayer} = {};
    private layerControl: L.Control.Layers;

  constructor() { 
    this.baseMaps = {
          OpenStreetMap: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            opacity: 1
        })
        // ,
        // Esri: L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        //     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        // })
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
        layers: [this.baseMaps.OpenStreetMap],
        attributionControl: false 
    });

    L.control.zoom({ position: "topleft" }).addTo(map);

    L.control.attribution({
        position: 'bottomright'
    })
    .addAttribution(`<a href="https://nl.linkedin.com/pub/guus-claessen/1b/8a7/608" style="text-decoration:none;">Map by Guus Claessen &nbsp;<img src="https://static.licdn.com/scds/common/u/img/webpromo/btn_in_20x15.png" width="20" height="15" alt="View Guus Claessen's LinkedIn profile" style="vertical-align:middle;" border="0"></a>`)
    .addAttribution("<a target='_blank' href='https://waterinfo.rws.nl'>Waterinfo Rijkswaterstaat</a>")
    .addTo(map);

    this.map = map;
    this.layerControl = L.control.layers();
    this.map.addControl(this.layerControl);
  }

  addLayer(layerId: string, name: string, zIndex: number, markers: L.Marker[], symbology: WaterInfoSymbologyCalculated) {
    //TODO more symbology type
    const layer = { layer: L.layerGroup(markers), name: name, symbology: symbology};
    this.layers[layerId] = layer;

    this.addPane(layerId, zIndex);
    this.addOverlay(layer);
    this.map.addLayer(layer.layer);
  }
 
  private addPane(paneId: string, zIndex: number) {
    if(!this.map.getPane(paneId)) {
      this.map.createPane(paneId);
    }
    this.map.getPane(paneId).style.zIndex = zIndex.toString();
  }

  private addOverlay(layer: WaterinfoLayer) {
    this.layerControl.addOverlay(layer.layer, layer.name);
  }

}