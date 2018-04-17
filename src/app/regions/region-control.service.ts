import { Injectable, Type } from '@angular/core';
import { Observable } from "rxjs/Observable";


enum Region {
  DataRegion,
  MapRegion
}

@Injectable()
export class RegionControlService {
  private componentsAdded: {[componentId: string] : {
      region: Region,
      component: Type<{}>
    }
  }

  constructor() { 
    this.componentsAdded = {};
  }

  addComponentToRegion(componentId: string, region: Region, component: Type<{}>) {
    const componentInfo = {componentId: componentId, component: component};
    return Observable.of(componentInfo);
  }

  activateComponent(componentId: string, showRegion: boolean) {
    const region = this.componentsAdded[componentId].region;
    if(showRegion) {
      this.showRegion(region);
    }
  }

  deactivateComponent(componentId: string, hideRegion: boolean) {
    const region = this.componentsAdded[componentId].region;
    if(hideRegion) {
      this.hideRegion(region);
    }
    //more

  }

  showRegion(region: Region) {

  }

  hideRegion(region: Region) {

  }

}
