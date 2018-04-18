import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// App
import { AppComponent } from './app.component';

// Leaflet
import { MapService } from './leaflet/map/service/map.service';
import { PopupService } from './leaflet/popup/service/popup.service';
import { LayerService } from './leaflet/layer/service/layer.service';
import { MapComponent } from './leaflet/map/component/map/map.component';

// Waterinfo
import { WaterinfoService } from './waterinfo/service/waterinfo.service';
import { WaterinfoLayerComponent } from './waterinfo/component/waterinfo-layer/waterinfo-layer.component';
import { WaterinfoRawComponent } from './waterinfo/component/waterinfo-raw/waterinfo-raw.component';
import { WaterinfoRawControlComponent } from './waterinfo/component/waterinfo-raw-control/waterinfo-raw-control.component';

// Tables for waterinfo
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatInputModule, MatProgressSpinnerModule } from "@angular/material";


// Surfsupmap
import { SurfsupMapLayerService } from './surfsup-map/surfsup-map-layer/service/surfsup-map-layer.service';
import { SurfsupMapIconService } from './surfsup-map/surfsup-map-icon/service/surfsup-map-icon.service';
import { SurfsupMapPopupComponent } from './surfsup-map/surfsup-map-popup/component/surfsup-map-popup.component';
import { MapRegionComponent } from './regions/map-region/map-region.component';
import { DataRegionComponent } from './regions/data-region/data-region.component';
import { DataRegionHeaderComponent } from './regions/data-region/data-region-header/data-region-header.component';
import { DataRegionDirective } from './regions/data-region/directive/data-region.directive';
import { RegionDirective } from './regions/region/region.directive';
import { RegionControlService } from './regions/region-control.service';
import { DummyComponent } from './dummy/dummy.component';
import { MapRegionDirective } from './regions/map-region/directive/map-region.directive';


@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        SurfsupMapPopupComponent,
        WaterinfoLayerComponent,
        WaterinfoRawComponent,
        WaterinfoRawControlComponent,
        MapRegionComponent,
        DataRegionComponent,
        DataRegionHeaderComponent,
        DataRegionDirective,
        RegionDirective,
        DummyComponent,
        MapRegionDirective
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        MatTableModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule
    ],
    providers: [
        MapService,
        PopupService,
        LayerService, 
        SurfsupMapLayerService,
        SurfsupMapIconService,
        WaterinfoService,
        RegionControlService
    ],
    entryComponents: [
        MapComponent,
        SurfsupMapPopupComponent,
        WaterinfoLayerComponent,
        WaterinfoRawControlComponent,
        WaterinfoRawComponent,
        DummyComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
