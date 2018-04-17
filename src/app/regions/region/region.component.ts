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
export abstract class RegionComponent<T extends RegionDirective> implements OnInit, OnDestroy {
	// export class RegionComponent<T extends RegionDirective> implements OnInit, OnDestroy {
	abstract name: RegionName;
	isActive: boolean;
	components: {[componentId: string]: Type<{}> }
	private componentSubscription: Subscription;

	@ViewChild(RegionDirective) 
	body: RegionDirective;
	
	constructor(private regionControlService: RegionControlService, private componentFactoryResolver: ComponentFactoryResolver) {
	}

	ngOnInit() {
		this.componentSubscription = this.regionControlService.componentSender$
			 .subscribe(componentInfo => {
				if(componentInfo.region === this.name) {
					console.log(this.name, componentInfo)
					
					 this.addBodyComponent(componentInfo.componentId, componentInfo.component);
					 this.loadBodyComponent(componentInfo.componentId);
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

}
