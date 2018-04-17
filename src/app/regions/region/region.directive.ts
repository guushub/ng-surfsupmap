import { Directive, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[appRegion]'
})
export class RegionDirective {
  
  constructor(public viewContainerRef: ViewContainerRef) { }

}