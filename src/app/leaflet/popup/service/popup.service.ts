import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, Type } from '@angular/core';

@Injectable()
export class PopupService {

	private componentRef: ComponentRef<{}>
	
	constructor(private cfr: ComponentFactoryResolver,
		private injector: Injector,
		private appRef: ApplicationRef) { }


	register(marker: L.Marker, component: Type<{}>, 
		setInstanceData: {(componentRef: ComponentRef<{}>): void}): void {
		this.bindPopup(marker, component, setInstanceData);
	}

	bindPopup(marker: L.Marker, component: Type<{}>,
		setInstanceData: {(componentRef: ComponentRef<{}>): void}) {
			marker.bindPopup(null);
			marker.on('click', (e) => {
				if (this.componentRef) this.componentRef.destroy();
				const compFactory = this.cfr.resolveComponentFactory(component);
				this.componentRef = compFactory.create(this.injector);
				setInstanceData(this.componentRef);
				
				this.appRef.attachView(this.componentRef.hostView);
				this.componentRef.onDestroy(() => {
					this.appRef.detachView(this.componentRef.hostView);
				});
				marker.bindPopup(this.componentRef.location.nativeElement)
				//marker.setPopupContent(this.componentRef.location.nativeElement);
			});
	}

}
