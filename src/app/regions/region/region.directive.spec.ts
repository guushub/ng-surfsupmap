import { RegionDirective } from './region.directive';
import { ViewContainerRef } from '@angular/core';

describe('RegionDirective', () => {
  it('should create an instance', () => {
    let viewContainerRef: ViewContainerRef;
    const directive = new RegionDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
