import { Injectable, Type } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs';
import { RegionName } from './model/region-name';
import { Region } from './model/region';


@Injectable()
export class RegionControlService {

	private componentSubject: BehaviorSubject<Region[]>;
	regionComponents$: Observable<Region[]>;

	// To find the component.
	private regionComponents: Region[];
	

	constructor() { 
		this.regionComponents = [];
		this.componentSubject = new BehaviorSubject<Region[]>(this.regionComponents);
		this.regionComponents$ = this.componentSubject.asObservable();
	}

	addComponentToRegion(componentId: string, region: RegionName, component: Type<{}>, isActive = false, postToggleBehavior?: {(isActive: boolean): void}) {
		const componentInfo = {componentId: componentId, component: component, region: region, isActive: isActive, postToggleBehavior: postToggleBehavior};
		this.regionComponents.push(componentInfo);
		this.componentSubject.next(this.regionComponents);
	}

	activateComponent(componentId: string, hideOthers = true) {
		if(hideOthers) {
			this.regionComponents.forEach(regionComponent => { 
				let preToggle = regionComponent.isActive;
				regionComponent.isActive = regionComponent.componentId === componentId;
				if(preToggle !== regionComponent.isActive && regionComponent.postToggleBehavior) {
					regionComponent.postToggleBehavior(regionComponent.isActive);
				}
			});
			
		} else {
			const regionComponent = this.regionComponents.find(regionComponent => regionComponent.componentId === componentId);
			if(regionComponent) {
				let preToggle = regionComponent.isActive;
				regionComponent.isActive = true;
				if(preToggle !== regionComponent.isActive && regionComponent.postToggleBehavior) {
					regionComponent.postToggleBehavior(regionComponent.isActive);
				}
			}
		}

		
		//console.log(this.regionComponents);
		this.componentSubject.next(this.regionComponents);
	}

	deactivateComponent(componentId: string, hideRegion: boolean) {
		const region = this.regionComponents[componentId].region;
		if(hideRegion) {
			this.hideRegion(region);
		}

	}

	showRegion(region: RegionName) {

	}

	hideRegion(region: RegionName) {

	}

}
