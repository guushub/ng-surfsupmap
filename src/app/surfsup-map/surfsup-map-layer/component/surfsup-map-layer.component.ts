import { Component, OnInit } from '@angular/core';
import { SurfsupMapLayerService } from '../service/surfsup-map-layer.service';
import * as SurfsupMapTheme from "../../surfsup-map-theme";

// TODO this component should only use surfsupmap services
import { WaterinfoService, WaterinfoGroup, WaterinfoParameter } from '../../../waterinfo/service/waterinfo.service';

interface SurfsupMapFormInput {
	parameter: WaterinfoParameter;
	
}

@Component({
	selector: 'app-surfsup-map-layer',
	templateUrl: './surfsup-map-layer.component.html',
	styleUrls: ['./surfsup-map-layer.component.css']
})
export class SurfsupMapLayerComponent implements OnInit {
	private surfsupMapGroupsAllowed = ["golven", "wind", "watertemperatuur"];

	active: boolean;
	canAdd = false;

	waterinfoGroups: WaterinfoGroup[] = [];
	waterinfoGroupSelected: WaterinfoGroup;

	quantityPar: WaterinfoParameter;
	directionPar: WaterinfoParameter;
	labelPar: WaterinfoParameter;

	constructor(private waterinfoService: WaterinfoService, private surfsupMapLayerService: SurfsupMapLayerService) { }

	ngOnInit() {
		this.active = false;
		
		// Make sure wave heights is top layer.
		this.addInitialLayerWind()
		.then(() => {
			return this.addInitialLayerGolven();
		})
		.then(() => {
			return this.addInitialLayerDeining();
		})
		.then(() => {

		});
	}
	
	toggle() {
		if(!this.active) {
			this.active = true;
			this.waterinfoService.getGroups()
			.subscribe(groups => {
				this.waterinfoGroups = groups.filter(group => this.surfsupMapGroupsAllowed.indexOf(group.slug.toLowerCase()) > -1);
				this.waterinfoGroupSelected = groups.find(group => group.slug.toLowerCase() === "golven");
			})
		} else {
			this.active = false;
			this.reset();
		}

	}

	addLayer() {
		//
		if(this.quantityPar && this.quantityPar.slug) {
			this.waterinfoService.getLatestAsSurfsupMapData(
				this.waterinfoGroupSelected.slug,
				this.quantityPar.slug,
				this.directionPar ? this.directionPar.slug : null,
				this.labelPar ? this.labelPar.slug : this.quantityPar.slug
			)
			.subscribe((points) => {
				const symbology = SurfsupMapTheme.getSymbologyByTheme(
					this.getThemeType(this.quantityPar.slug)
				)

				const legendText = points[0].properties.data.quantity.parameter.name;
				this.surfsupMapLayerService.addLayer(points, symbology, legendText);
				this.reset();
			});
		}
	}

	private clearParameterSelection() {
		this.quantityPar = null;
		this.directionPar = null;
		this.labelPar = null;
		this.canAdd = false;
	}

	private getThemeType(slug: string) {
		const unit = this.getSlugUnit(slug);
		switch (unit) {
			case "cm":
				return SurfsupMapTheme.ThemeType.cm;
			case "m/s":
				return SurfsupMapTheme.ThemeType["m/s"];
			case "m___2Fs":
				return SurfsupMapTheme.ThemeType["m/s"];
			case "s":
				return SurfsupMapTheme.ThemeType.s;
			default:
				return SurfsupMapTheme.ThemeType.cm;
		}
	}

	private getSlugUnit(slug: string) {
		const splitted = slug.split("___20");
		const unit = splitted ? splitted[splitted.length - 1] : "";
		return unit;
	}

	private directionParameters() {
		return this.waterinfoGroupSelected.parameters.filter(par => {
			const unit = this.getSlugUnit(par.slug);
			if(unit === "graad") {
				return par;
			}
		});
	}

	private quantityParameters() {
		return this.waterinfoGroupSelected.parameters.filter(par => {
			const unit = this.getSlugUnit(par.slug);
			if(unit !== "graad") {
				return par;
			}
		});
	}

	private canBeDirection(parameter: WaterinfoParameter) {
		const unit = this.getSlugUnit(parameter.slug);
		return unit === "graad";
	}

	private onWaterinfoGroupSelect(waterinfoGroupSelected: WaterinfoGroup) {
		this.clearParameterSelection();
		this.waterinfoGroupSelected = waterinfoGroupSelected;
	}

	private handleCheckboxQuantity(parameter: WaterinfoParameter) {
		if(this.quantityPar === parameter) {
			this.quantityPar = null;
			this.canAdd = false;
		} else {
			this.quantityPar = parameter;
			this.labelPar = !this.labelPar ? parameter : this.labelPar;
			this.canAdd = true;
		}
	}

	private handleCheckboxDirection(parameter: WaterinfoParameter) {
		if(this.directionPar === parameter) {
			this.directionPar = null;
		} else {
			this.directionPar = parameter;
		}
	}

	private handleCheckboxLabel(parameter: WaterinfoParameter) {
		if(this.labelPar === parameter) {
			this.labelPar = null;
		} else {
			this.labelPar = parameter;
		}
	}

	private reset() {
		this.active = false;
		this.canAdd = false;
	
		this.waterinfoGroups = [];
		this.waterinfoGroupSelected = null;

		this.clearParameterSelection();

	}

	addInitialLayerWind() {
		return new Promise((resolve, reject) => {
			this.waterinfoService.getLatestAsSurfsupMapData(
				"Wind",
				"Windsnelheid___20Lucht___20t.o.v.___20Mean___20Sea___20Level___20in___20m___2Fs",
				"Windrichting___20Lucht___20t.o.v.___20ware___20Noorden___20in___20graad",
				"Windsnelheid___20Lucht___20t.o.v.___20Mean___20Sea___20Level___20in___20m___2Fs"
			)
			.subscribe((points) => {
				const symbology = SurfsupMapTheme.getSymbologyByTheme(
					SurfsupMapTheme.ThemeType["m/s"],
					SurfsupMapTheme.ThemeColor.orange
				)
	
				const legendText = points[0].properties.data.quantity.parameter.name;
	
				this.surfsupMapLayerService.addLayer(points, symbology, legendText);
				resolve();
			});
		});

	}

	addInitialLayerGolven() {
		return new Promise((resolve, reject) => {
			this.waterinfoService.getLatestAsSurfsupMapData(
				"Golven",
				"Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm",
				"Gemiddelde___20golfrichting___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20graad",
				"Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm"
			)
			.subscribe((points) => {
				const symbology = SurfsupMapTheme.getSymbologyByTheme(
					SurfsupMapTheme.ThemeType.cm,
					SurfsupMapTheme.ThemeColor.purple
				)
	
				const legendText = points[0].properties.data.quantity.parameter.name;
	
				this.surfsupMapLayerService.addLayer(points, symbology, legendText);
				resolve();
			});
		});

	}

	addInitialLayerDeining() {
		return new Promise((resolve, reject) => {
			this.waterinfoService.getLatestAsSurfsupMapData(
				"Golven",
				"Significante___20deiningshoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20cm",
				"Gem.___20richting___20deining___20tov___20ware___20noorden___20in___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20graad",
				"Significante___20deiningshoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20cm"
			)
			.subscribe((points) => {
				const symbology = SurfsupMapTheme.getSymbologyByTheme(
					SurfsupMapTheme.ThemeType.cm,
					SurfsupMapTheme.ThemeColor.darkblue
				)
	
				const legendText = points[0].properties.data.quantity.parameter.name;
	
				this.surfsupMapLayerService.addLayer(points, symbology, legendText);
				resolve();
			});
		});

	}

}
