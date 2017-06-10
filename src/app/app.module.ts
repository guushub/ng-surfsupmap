import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// services
import { MapMainService } from './services/map/map-main.service';

// components
import { AppComponent } from './app.component';
import { MapPanelLeftComponent } from './components/map-panel/map-panel-left/map-panel-left.component';

@NgModule({
  declarations: [
    AppComponent,
    MapPanelLeftComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    MapMainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
