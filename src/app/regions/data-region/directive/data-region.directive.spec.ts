import { DataRegionDirective } from './data-region.directive';
import { ViewContainerRef } from '@angular/core';

describe('DataRegionDirective', () => {
  it('should create an instance', () => {
    let viewContainerRef: ViewContainerRef;
    const directive = new DataRegionDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
