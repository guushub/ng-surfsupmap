import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef } from '@angular/core';
import { SurfsupMapPopupComponent } from "../../components/popup/surfsup-map-popup/surfsup-map-popup.component";

@Injectable()
export class PopupService {

	private componentRef: ComponentRef<SurfsupMapPopupComponent>
	
	constructor(private cfr: ComponentFactoryResolver,
		private injector: Injector,
		private appRef: ApplicationRef) { }


	register(marker: L.Marker, content: string): void {
		this.bindPopup(marker, content);
	}

	bindPopup(marker: L.Marker, content: string) {
		marker.bindPopup(null);
        marker.on('click', (e) => {
            if (this.componentRef) this.componentRef.destroy();
            const compFactory = this.cfr.resolveComponentFactory(SurfsupMapPopupComponent);
            this.componentRef = compFactory.create(this.injector);
            this.componentRef.instance.testVar = content;

            this.appRef.attachView(this.componentRef.hostView);
            this.componentRef.onDestroy(() => {
                this.appRef.detachView(this.componentRef.hostView);
			});
			
            let div = document.createElement('div');
            div.appendChild(this.componentRef.location.nativeElement);
            marker.setPopupContent(div);
		});

	}

}
