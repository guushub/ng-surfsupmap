import { Injectable, Type } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs';
import { RegionName } from './model/region-name';

interface ComponentInfo {
	componentId: string;
	component: Type<{}>;
	region: RegionName;
}

@Injectable()
export class RegionControlService {

	private componentSubject: BehaviorSubject<ComponentInfo>;
	componentSender$: Observable<ComponentInfo>;

	// To find the component.
	private componentsAdded: ComponentInfo[];
	

	constructor() { 
		this.componentSubject = new BehaviorSubject<ComponentInfo>(null);
		this.componentSender$ = this.componentSubject.asObservable();
		this.componentsAdded = [];

		this.componentSender$.subscribe(componentInfo => {
			//TODO maybe need confirmation from receiving region.
			this.componentsAdded.push(componentInfo);
		})
	}

	addComponentToRegion(componentId: string, region: RegionName, component: Type<{}>) {
		const componentInfo = {componentId: componentId, component: component, region: region};
		console.log(componentInfo);
		this.componentSubject.next(componentInfo);
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

	showRegion(region: RegionName) {

	}

	hideRegion(region: RegionName) {

	}

}
