import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, Type } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';


@Injectable()
export class MapService {
    public map: L.Map;
    public baseMaps: L.Control.LayersObject;
    private layerGroups: { [layerGoupId: number]: L.LayerGroup } = {};

    public layerControl: L.Control.Layers;
    private zIndexBase = 600;

    private layers = {};

    

    constructor(private cfr: ComponentFactoryResolver, private injector: Injector, private appRef: ApplicationRef) {
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
        // The dom is probably not ready yet, so call this from a component's 'ngOnInit()'. Something like:
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
        this.addControls();

    }
    private addPane(layerId: number) {
        const paneId = `pane-${layerId}`;
        const zIndex = this.zIndexBase + 5 * layerId;

        if (!this.map.getPane(paneId)) {
            this.map.createPane(paneId);
        }
        this.map.getPane(paneId).style.zIndex = zIndex.toString();

        return paneId;
    }

    
    // private getLayerIdByLayer(layer: L.LayerGroup) {
    //     for (const layerId in this.layerGroups) {
    //         if (this.layerGroups.hasOwnProperty(layerId)) {
    //             if(this.layerGroups[layerId] === layer) {
    //                 return Number(layerId);
    //             }
    //         }
    //     }
    //     return;
    // }

    private addControls() {
        // Layer control
        const options: any = {
            sortLayers: true,
            sortFunction: (layerA: L.LayerGroup, layerB: L.LayerGroup) => {
                const layerIdA = layerA.getPane().style.zIndex;
                const layerIdB = layerB.getPane().style.zIndex;
                return layerIdB > layerIdA;
            },
            collapsed: false
        }
        this.layerControl = L.control.layers(null, null, options);
        this.map.addControl(this.layerControl);

        // Handle events that should do something with layer control collapse/expand.
        this.layerControlCollapseHandler();
        
        this.map.on('click', () => {
            this.layerControlCollapseHandler();
        });

        $(window).on('resize', (event) => {
            this.layerControlCollapseHandler();
        })
    }

    private layerControlCollapseHandler() {
        if(window.innerWidth >= 760) {
            this.layerControl.expand();
        } else {
            this.layerControl.collapse();
        }
    }

    injectComponentToControl(component: Type<{}>, position: string) {
        
        const componentControl = L.Control.extend({
            options: {
                position: position 
                //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
              },
             
            onAdd: (map) => {
                const container = L.DomUtil.create('div');
                // setTimeout(() => { this.loadComponent(container, component) });
                setTimeout(() => {
                    const compFactory = this.cfr.resolveComponentFactory(component);
                    const componentRef = compFactory.create(this.injector);
                    this.appRef.attachView(componentRef.hostView);
                    componentRef.onDestroy(() => {
                        this.appRef.detachView(componentRef.hostView);
                    });
            
                    const html = componentRef.location.nativeElement;
                    container.appendChild(html);
                });
                
                return container;
            }   
        })
        	
        this.map.addControl(new componentControl());

    }

    // private loadComponent(container, component: Type<{}>) {
    //     const compFactory = this.cfr.resolveComponentFactory(component);
    //     const componentRef = compFactory.create(this.injector);
    //     this.appRef.attachView(componentRef.hostView);
    //     componentRef.onDestroy(() => {
    //         this.appRef.detachView(componentRef.hostView);
    //     });

    //     const html = componentRef.location.nativeElement;
    //     container.appendChild(html);
    // }
    
}