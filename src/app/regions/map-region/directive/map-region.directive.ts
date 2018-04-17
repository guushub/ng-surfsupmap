import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appMapRegion]'
})
export class MapRegionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
