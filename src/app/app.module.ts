import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// services
import { MapMainService } from './services/map/map-main.service';
import { SurfsupLayerMapService } from './services/layer/surfsup-map-layer.service';
import { WaterinfoService } from './services/waterinfo/waterinfo.service';
import { PopupService } from './services/popup/popup.service';

// components & directives
import { AppComponent } from './app.component';
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';
import { SurfsupMapPopupComponent } from './components/popup/surfsup-map-popup/surfsup-map-popup.component';
import { SurfsupMapLayerAddComponent } from './components/surfsup-map-layer-add/surfsup-map-layer-add.component';

@NgModule({
    declarations: [
        AppComponent,
        MapPanelLeftComponent,
        SurfsupMapPopupComponent,
        SurfsupMapLayerAddComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule
    ],
    providers: [
        MapMainService,
        SurfsupLayerMapService,
        WaterinfoService,
        PopupService
    ],
    entryComponents: [
        SurfsupMapPopupComponent,
        SurfsupMapLayerAddComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
