import { MapRegionDirective } from './map-region.directive';
import { ViewContainerRef } from '@angular/core';

describe('MapRegionDirective', () => {
  it('should create an instance', () => {
    let viewContainerRef: ViewContainerRef;
    const directive = new MapRegionDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
