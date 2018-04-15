import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, Type, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';


@Injectable()
export class MapService {
    public map: L.Map;
    public layerControl: L.Control.Layers;
    public onLoad: EventEmitter<L.Map>;
    public hide: EventEmitter<boolean>;

    private latLngInit = L.latLng(54, 5);
    private zoomLevelInit = 6;

    private baseMaps: L.Control.LayersObject;
    private layerGroups: { [layerGoupId: number]: L.LayerGroup } = {};
    private layerControlCanAutoExpand = false;
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

        this.onLoad = new EventEmitter<L.Map>();
        this.hide = new EventEmitter<boolean>();


    }

    setMap(divId: string) {
        // Note that we can't set the map itself yet when constructing/initializing this service.  
        // The dom is probably not ready yet, so call this from a component's 'ngOnInit()'. Something like:
        // this.mapMainService.setMap("map-main");   

        this.map = L.map(divId, {
            zoomControl: false,
            // center: L.latLng(54, 5),
            layers: [this.baseMaps.OpenStreetMap],
            attributionControl: false
        })
        
        this.addControls();
        
        this.map.on('load', () => {
            this.onLoad.emit(this.map);
        }).setView(this.latLngInit, this.zoomLevelInit);

        this.hide.emit(false);

    }

    resetView() {
        this.map.setView(this.latLngInit, this.zoomLevelInit);
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

    private addControls() {
        // Zoom control
        L.control.zoom({ position: "topleft" }).addTo(this.map);

        // Attribution control
        L.control.attribution({
            position: 'bottomright'
        })
        .addAttribution(`<a href="https://nl.linkedin.com/pub/guus-claessen/1b/8a7/608" style="text-decoration:none;">Map by Guus Claessen &nbsp;<img src="https://static.licdn.com/scds/common/u/img/webpromo/btn_in_20x15.png" width="20" height="15" alt="View Guus Claessen's LinkedIn profile" style="vertical-align:middle;" border="0"></a>`)
        .addAttribution("<a target='_blank' href='https://waterinfo.rws.nl'>Waterinfo Rijkswaterstaat</a>")
        .addTo(this.map);

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
        if(!this.layerControlCanAutoExpand) {
            this.layerControl.collapse();
            return;
        }

        if(window.innerWidth >= 760) {
            this.layerControl.expand();
        } else {
            this.layerControl.collapse();
        }
    }

    layerControlAutoExpandPause() {
        this.layerControl.collapse();
		this.layerControlCanAutoExpand = false;
    }
    
    layerControlAutoExpandResume() {
        this.layerControlCanAutoExpand = true;
        this.layerControlCollapseHandler();
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