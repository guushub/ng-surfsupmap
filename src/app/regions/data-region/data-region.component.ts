import { Component, ViewChild } from '@angular/core';
import { RegionComponent } from '../region/region.component';
import { DataRegionDirective } from './directive/data-region.directive';
import { RegionName } from '../model/region-name';

@Component({
  selector: 'app-data-region',
  templateUrl: './data-region.component.html',
  styleUrls: ['./data-region.component.css']
})
export class DataRegionComponent extends RegionComponent<DataRegionDirective>  {
  name = RegionName.DataRegion;
  
  @ViewChild(DataRegionDirective)
  body: DataRegionDirective;

}
