import { Component, OnInit, ViewChild, Type, ComponentFactoryResolver } from '@angular/core';
import { MapService } from '../../leaflet/map/service/map.service';
import { DataRegionDirective } from './directive/data-region.directive';
import { RegionControlService } from '../region-control.service';

@Component({
  selector: 'app-data-region',
  templateUrl: './data-region.component.html',
  styleUrls: ['./data-region.component.css']
})
export class DataRegionComponent implements OnInit {
  isActive = false;
  components: {[componentId: string]: Type<{}> }
  @ViewChild(DataRegionDirective) body: DataRegionDirective;
  //TODO: @ViewChild(DataRegionHeaderDirective) header: DataRegionHeaderDirective;
  //TODO: host controler service; mapservice shouldnt have influence on this.
  constructor(private mapService: MapService, private regionControlService: RegionControlService, private componentFactoryResolver: ComponentFactoryResolver) { 
    
    //TODO should be emiter... regionControlService.addComponentToRegion
  }

  ngOnInit() {
    this.mapService.hide.subscribe(hideMap => {
			this.isActive=hideMap;
		});
  }

  addBodyComponent(componentId: string, component: Type<{}>) {
    if(!this.components) {
      this.components = {}
    }

    this.components[componentId] = component;
  }

  loadBodyComponent(componentId: string) {
    if(!this.components || !this.components[componentId]) {
      // TODO logging
      return;
    }

    const component = this.components[componentId];
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.body.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
  }

}
