import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { SurfsupMapLayerService } from '../../../surfsup-map/surfsup-map-layer/service/surfsup-map-layer.service'

import * as Waterinfo from '../../model/waterinfo';
import { WaterinfoSurfsupMapInput, WaterinfoUtils } from '../../helper/waterinfo-utils';
import { WaterinfoService } from '../../service/waterinfo.service';
import { MapService } from '../../../leaflet/map/service/map.service';

@Component({
	selector: 'app-waterinfo-layer',
	templateUrl: './waterinfo-layer.component.html',
	styleUrls: ['./waterinfo-layer.component.css']
})
export class WaterinfoLayerComponent implements OnInit {

    private windLocationCodesAllowed = [4529, 4755, 2173, 4807, 1310, 4127, 2719, 4586, 3283, 2721, 2175, 1073, 1617, 1092, 1075, 3905, 4953, 4455, 4864, 4865, 516];
	private surfsupMapGroupsAllowed = ["golven", "wind", "watertemperatuur"];

	active: boolean;
	canAdd = false;

	waterinfoGroups: Waterinfo.WaterinfoGroup[] = [];
	waterinfoGroupSelected: Waterinfo.WaterinfoGroup;

	quantityPar: Waterinfo.WaterinfoParameter;
	directionPar: Waterinfo.WaterinfoParameter;
	labelPar: Waterinfo.WaterinfoParameter;

	constructor(private waterinfoService: WaterinfoService, private surfsupMapLayerService: SurfsupMapLayerService, 
		// TODO: make global event/command service.
		private mapService: MapService) { }

	ngOnInit() {
		this.active = false;
		
		// Make sure wave heights is top layer.
		this.addInitialLayerGolven()
		.then(() => {
			return this.addInitialLayerWind();
		})
		.then(() => {
			return this.addInitialLayerDeining();
		});

	}
	
	toggle() {
		if(!this.active) {
			this.active = true;
			this.mapService.layerControlAutoExpandPause();
			
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

	handleAddLayerCommand() {
		if(this.quantityPar && this.quantityPar.slug) {
			this.addLayer(
				this.waterinfoGroupSelected.slug,
				this.quantityPar.slug,
				this.directionPar ? this.directionPar.slug : null,
				this.labelPar ? this.labelPar.slug : this.quantityPar.slug
			)
			.then(() => {
				this.reset();
			});
		}
	}



	directionParameters() {
		return this.waterinfoGroupSelected.parameters.filter(par => {
			const unit = WaterinfoUtils.getUnitFromSlug(par.slug);
			if(unit === "graad") {
				return par;
			}
		});
	}

	quantityParameters() {
		return this.waterinfoGroupSelected.parameters.filter(par => {
			const unit = WaterinfoUtils.getUnitFromSlug(par.slug);
			if(unit !== "graad") {
				return par;
			}
		});
	}

	canBeDirection(parameter: Waterinfo.WaterinfoParameter) {
		const unit = WaterinfoUtils.getUnitFromSlug(parameter.slug);
		return unit === "graad";
	}

	onWaterinfoGroupSelect(waterinfoGroupSelected: Waterinfo.WaterinfoGroup) {
		this.clearParameterSelection();
		this.waterinfoGroupSelected = waterinfoGroupSelected;
	}

	handleCheckboxQuantity(parameter: Waterinfo.WaterinfoParameter) {
		if(this.quantityPar === parameter) {
			this.quantityPar = null;
			this.canAdd = false;
		} else {
			this.quantityPar = parameter;
			this.labelPar = !this.labelPar ? parameter : this.labelPar;
			this.canAdd = true;
		}
	}

	handleCheckboxDirection(parameter: Waterinfo.WaterinfoParameter) {
		if(this.directionPar === parameter) {
			this.directionPar = null;
		} else {
			this.directionPar = parameter;
		}
	}

	handleCheckboxLabel(parameter: Waterinfo.WaterinfoParameter) {
		if(this.labelPar === parameter) {
			this.labelPar = null;
		} else {
			this.labelPar = parameter;
		}
	}

	reset() {

		this.active = false;
		this.mapService.layerControlAutoExpandResume();
		this.canAdd = false;
	
		this.waterinfoGroups = [];
		this.waterinfoGroupSelected = null;

		this.clearParameterSelection();

	}

	addInitialLayerWind() {
		return this.addLayer(
				"Wind",
				"Windsnelheid___20Lucht___20t.o.v.___20Mean___20Sea___20Level___20in___20m___2Fs",
				"Windrichting___20Lucht___20t.o.v.___20ware___20Noorden___20in___20graad",
				"Windsnelheid___20Lucht___20t.o.v.___20Mean___20Sea___20Level___20in___20m___2Fs",
				true
			);
	}

	addInitialLayerGolven() {
		return this.addLayer(
				"Golven",
				"Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm",
				"Gemiddelde___20golfrichting___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20graad",
				"Significante___20golfhoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20500___20mHz___20in___20cm",
				true
			);
	}

	addInitialLayerDeining() {
		return this.addLayer(
				"Golven",
				"Significante___20deiningshoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20cm",
				"Gem.___20richting___20deining___20tov___20ware___20noorden___20in___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20graad",
				"Significante___20deiningshoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20cm",
				true
			);
	}

	private getWaterinfoSurfsupMapInput(group: string, parIdQuantity: string, parIdDirection?: string, parIdLabel?: string): Promise<WaterinfoSurfsupMapInput[]> {
		return new Promise<WaterinfoSurfsupMapInput[]>((resolve, reject) => {
			let parameterQuantity: Waterinfo.WaterinfoParameter;
			let parameterDirection: Waterinfo.WaterinfoParameter;
			let parameterLabel: Waterinfo.WaterinfoParameter;
			
			const parIdsToFetch = [parIdQuantity, parIdDirection, parIdLabel].filter(par => !!par);
			this.waterinfoService.getParametersCombined(parIdsToFetch).toPromise()
			.then(parameters => {
				if(!parameters) {
					return;
				}
				const nPars = parameters.length;
				parameterQuantity = parameters[0];
	
				if(parameters.length > 1 && parameters[1].slug === parIdDirection) {
					parameterDirection = parameters[1]
				}
				
				if(parameters.length > 1 && parameters[nPars - 1].slug === parIdLabel) {
					parameterLabel = parameters[nPars - 1]
				}
	
				return this.waterinfoService.getLatest(parIdsToFetch).toPromise();
			})
			.then(featureCollection => {
				const inputs = WaterinfoUtils.featureCollectionToWaterinfoSurfsupMapInputs(group, featureCollection, parameterQuantity, parameterDirection, parameterLabel);
				resolve(inputs);
			})
			.catch((error) => {
				reject(error);
			});
		});
		

	}

	private addLayer(group: string, parIdQuantity: string, parIdDirection?: string, parIdLabel?: string, isPreset = false) {
		return new Promise((resolve, reject) => {
			this.getWaterinfoSurfsupMapInput(group, parIdQuantity, parIdDirection, parIdLabel)
			.then(layerInputs => {
				if(group.toLowerCase() === "wind") {
					layerInputs = layerInputs.filter(input => this.windLocationCodesAllowed.indexOf(Number(input.locationCode)) > -1);
				}

				const layer = WaterinfoUtils.getSurfsupMapLayer(layerInputs, isPreset);
				if(layer) {
					this.surfsupMapLayerService.addLayer(layer);
				}
				resolve();
			})
			.catch(err => {
				reject(err);
			});
		});
	}

	private clearParameterSelection() {
		this.quantityPar = null;
		this.directionPar = null;
		this.labelPar = null;
		this.canAdd = false;
	}

}
