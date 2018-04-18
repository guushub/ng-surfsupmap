import { Injectable, Type } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs';
import { RegionName } from './model/region-name';

interface RegionComponent {
	componentId: string;
	isActive: boolean;
	component: Type<{}>;
	region: RegionName;
}

@Injectable()
export class RegionControlService {

	private componentSubject: BehaviorSubject<RegionComponent[]>;
	regionComponents$: Observable<RegionComponent[]>;

	// To find the component.
	private regionComponents: RegionComponent[];
	

	constructor() { 
		this.regionComponents = [];
		this.componentSubject = new BehaviorSubject<RegionComponent[]>(this.regionComponents);
		this.regionComponents$ = this.componentSubject.asObservable();
	}

	addComponentToRegion(componentId: string, region: RegionName, component: Type<{}>, isActive = false) {
		const componentInfo = {componentId: componentId, component: component, region: region, isActive: isActive};
		this.regionComponents.push(componentInfo);
		this.componentSubject.next(this.regionComponents);
	}

	activateComponent(componentId: string, hideOthers = true) {
		if(hideOthers) {
			this.regionComponents.forEach(regionComponent => { 
				regionComponent.isActive = regionComponent.componentId === componentId;
			});
			
		} else {
			const regionComponent = this.regionComponents.find(regionComponent => regionComponent.componentId === componentId);
			if(regionComponent) {
				regionComponent.isActive = true;
			}
		}
		console.log(this.regionComponents);
		this.componentSubject.next(this.regionComponents);
	}

	deactivateComponent(componentId: string, hideRegion: boolean) {
		const region = this.regionComponents[componentId].region;
		if(hideRegion) {
			this.hideRegion(region);
		}
		//more

	}

	showRegion(region: RegionName) {

	}

	hideRegion(region: RegionName) {

	}

}
