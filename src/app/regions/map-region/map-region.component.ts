import { Component, ViewChild } from '@angular/core';
import { RegionComponent } from '../region/region.component';
import { RegionDirective } from '../region/region.directive';
import { RegionName } from '../model/region-name';
import { MapRegionDirective } from './directive/map-region.directive';


@Component({
  selector: 'app-map-region',
  templateUrl: './map-region.component.html',
  styleUrls: ['./map-region.component.css']
})
export class MapRegionComponent extends RegionComponent {
  name = RegionName.MapRegion;

  @ViewChild(MapRegionDirective)
  body: MapRegionDirective;

}
