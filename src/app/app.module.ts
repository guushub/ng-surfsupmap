import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

// services
import { MapMainService } from './services/map/map-main.service';
import { WaterinfoOldService } from './services/waterinfo/waterinfo-old.service';

// components
import { AppComponent } from './app.component';
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

@NgModule({
  declarations: [
    AppComponent,
    MapPanelLeftComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    MapMainService,
    WaterinfoOldService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
