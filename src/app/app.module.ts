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

// Waterinfo
import { WaterinfoService } from './waterinfo/service/waterinfo.service';
import { WaterinfoLayerComponent } from './waterinfo/component/waterinfo-layer.component';

// Surfsupmap
import { SurfsupMapLayerService } from './surfsup-map/surfsup-map-layer/service/surfsup-map-layer.service';
import { SurfsupMapIconService } from './surfsup-map/surfsup-map-icon/service/surfsup-map-icon.service';
import { SurfsupMapPopupComponent } from './surfsup-map/surfsup-map-popup/component/surfsup-map-popup.component';



@NgModule({
    declarations: [
        AppComponent,
        SurfsupMapPopupComponent,
        WaterinfoLayerComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule
    ],
    providers: [
        MapService,
        PopupService,
        LayerService, 
        SurfsupMapLayerService,
        SurfsupMapIconService,
        WaterinfoService
    ],
    entryComponents: [
        SurfsupMapPopupComponent,
        WaterinfoLayerComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
