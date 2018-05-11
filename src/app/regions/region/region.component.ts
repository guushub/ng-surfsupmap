import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { RegionName } from "../model/region-name";
import { Type } from "@angular/core";
import { Subscription } from 'rxjs';
import { RegionControlService } from '../region-control.service';

// import { Directive } from '@angular/compiler/src/core';
import { RegionDirective } from './region.directive';


@Component({
	selector: 'app-region',
	template: ''
})
export class RegionComponent implements OnInit, OnDestroy {
	// export class RegionComponent<T extends RegionDirective> implements OnInit, OnDestroy {
	name: RegionName;
	isActive: boolean = true;
	components: {[componentId: string]: Type<{}> }
	private componentSubscription: Subscription;

	@ViewChild(RegionDirective) 
	body: RegionDirective;
	
	constructor(private regionControlService: RegionControlService, private componentFactoryResolver: ComponentFactoryResolver) {
	}

	ngOnInit() {
		this.componentSubscription = this.regionControlService.regionComponents$
			 .subscribe(regionComponents => {
				const regionComponent = regionComponents.find(regionComponent => regionComponent.region === this.name);
				if(regionComponent) {
					this.isActive = regionComponent.isActive;
					this.addBodyComponent(regionComponent.componentId, regionComponent.component);
				}

				if(this.isActive) {
					this.loadBodyComponent(regionComponent.componentId);
				}
				
			 });
	}
	
	ngOnDestroy() {
		// prevent memory leak when component is destroyed
		this.componentSubscription.unsubscribe();
	}

	private addBodyComponent(componentId: string, component: Type<{}>) {
		if(!this.components) {
		  this.components = {}
		}

		this.components[componentId] = component;
	  }
	
	loadBodyComponent(componentId: string) {
		if(!this.components || !this.components[componentId]) {
		  // TODO logging
		  return;
		}
	
		const component = this.components[componentId];
		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
		let viewContainerRef = this.body.viewContainerRef;
		viewContainerRef.clear();
		let componentRef = viewContainerRef.createComponent(componentFactory);
	  }

	postToggleBehavior() {
		console.log("Toggle...");
	}

}
