import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDataRegion]'
})
export class DataRegionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
