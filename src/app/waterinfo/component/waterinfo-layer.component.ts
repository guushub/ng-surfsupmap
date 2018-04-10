import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { SurfsupMapLayerService } from '../../surfsup-map/surfsup-map-layer/service/surfsup-map-layer.service'

import { WaterinfoService, WaterinfoProperties, WaterinfoLatestMeasurement } from '../service/waterinfo.service';
import { SurfsupMapLayer, SurfsupMapLocation, ThemeType, ThemeColor } from '../../surfsup-map/surfsup-map-layer/model/surfsup-map-layer';

import { WaterinfoPoint } from '../model/waterinfo-point';
import { WaterinfoGroup } from '../model/waterinfo-group';
import { WaterinfoParameter } from '../model/waterinfo-parameter';
import { WaterinfoSurfsupMapInput } from '../helper/waterinfo-utils';

@Component({
	selector: 'app-waterinfo-layer',
	templateUrl: './waterinfo-layer.component.html',
	styleUrls: ['./waterinfo-layer.component.css']
})
export class WaterinfoLayerComponent implements OnInit {

    private windLocationCodesAllowed = [4755, 2173, 4807, 1310, 3874, 4127, 2719, 4586, 3283, 2721, 2175, 1073, 1617, 1092, 1075, 3905, 4953, 4455, 4864, 4865, 516];
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
			this.getCombined();
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
				const themeType = this.getThemeType(this.quantityPar.slug);
				const locations = this.mapToLocations(points);
				const layer = new SurfsupMapLayer(locations, themeType);
				this.surfsupMapLayerService.addLayer(layer);
				this.reset();
			});
		}
	}

	private mapToLocations(points: WaterinfoPoint[]) {
		const locations: SurfsupMapLocation[] = points.map((point) => {
			if(point.properties.group.toLowerCase() === "wind" && this.windLocationCodesAllowed.indexOf(Number(point.properties.locationCode)) === -1) {
				return;
			}

			const location: SurfsupMapLocation = {
				quantityData: point.properties.data.quantity,
				directionData: point.properties.data.direction,
				labelData: point.properties.data.label,
				id: point.properties.locationCode,
				name: point.properties.name,
				latLng: point.latLng(),
				attribution: this.getAttribution(point)
			}
			return location;
		});

		return locations.filter(location => !!location);
	}


	private getAttribution(point: WaterinfoPoint) {
		const parameters: string[] = [];
		parameters.push(point.properties.data.quantity.parameter.id);
		if(point.properties.data.direction && parameters.indexOf(point.properties.data.direction.parameter.id) < 0) parameters.push(point.properties.data.direction.parameter.id);
		if(point.properties.data.label && parameters.indexOf(point.properties.data.label.parameter.id) < 0) parameters.push(point.properties.data.label.parameter.id);
		
		const waterinfoUrl  = `https://waterinfo.rws.nl/#!/details/expert/${point.properties.group}/${point.properties.locationCode}/${parameters.join(",")}`
		const attr = {
			url: waterinfoUrl,
			text: "Bron en grafieken: waterinfo.rws.nl"
			
		}
		return attr;
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
				return ThemeType.cm;
			case "m/s":
				return ThemeType["m/s"];
			case "m___2Fs":
				return ThemeType["m/s"];
			case "s":
				return ThemeType.s;
			default:
				return ThemeType.cm;
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
				const locations = this.mapToLocations(points);
				const layer = new SurfsupMapLayer(locations, ThemeType["m/s"], ThemeColor.orange);
				this.surfsupMapLayerService.addLayer(layer);


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
				const locations = this.mapToLocations(points);
				const layer = new SurfsupMapLayer(locations, ThemeType.cm, ThemeColor.purple);
				this.surfsupMapLayerService.addLayer(layer);
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
				const locations = this.mapToLocations(points);
				const layer = new SurfsupMapLayer(locations, ThemeType.cm, ThemeColor.darkblue);
				this.surfsupMapLayerService.addLayer(layer);
				resolve();
			});
		});

	}

	getCombined() {
		const group = "Golven";
		const parIdQuantity = "Significante___20deiningshoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20cm";
		const parIdDirection = "Gem.___20richting___20deining___20tov___20ware___20noorden___20in___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20graad";
		const parIdLabel = "Significante___20deiningshoogte___20in___20het___20spectrale___20domein___20Oppervlaktewater___20golffrequentie___20tussen___2030___20en___20100___20mHz___20in___20cm";

		let parameterQuantity: WaterinfoParameter;
		let parameterDirection: WaterinfoParameter;
		let parameterLabel: WaterinfoParameter;
		
		// TODO: fork?
		this.waterinfoService.getParameterById(parIdQuantity).toPromise()
		.then(par => {
			parameterQuantity = par;
			return this.waterinfoService.getParameterById(parIdDirection).toPromise();
		})
		.then(par => {
			parameterDirection = par;
			return this.waterinfoService.getParameterById(parIdLabel).toPromise();
		})
		.then(par => {
			parameterLabel = par;
			return this.waterinfoService.getLatestCombined([parIdQuantity, parIdDirection, parIdLabel]).toPromise();
		})
		.then(featureCollection => {
			const dataInput: WaterinfoSurfsupMapInput[] = [];
			const features = featureCollection.features;

			features.forEach((feature) => {
				const properties = feature.properties as WaterinfoProperties;
				if(properties.measurements.length > 0 && properties.measurements[0].parameterId === parIdQuantity) {
					const nMeasurements = properties.measurements.length;
					const quantityData = {
						measurement: properties.measurements[0],
						parameter: parameterQuantity
					}

					// TODO check if measurement exists.
					let directionData;
					if(parameterDirection && properties.measurements.length > 1 && properties.measurements[1].parameterId === parIdDirection) {
						directionData = {
							measurement: properties.measurements[1],
							parameter: parameterDirection
						}
					}

					let labelData;
					if(parameterLabel && properties.measurements.length > 1 && properties.measurements[nMeasurements - 1].parameterId === parIdLabel) {
						labelData = {
							measurement: properties.measurements[nMeasurements - 1],
							parameter: parameterLabel
						}
					}

					const input: WaterinfoSurfsupMapInput = {
						locationCode: properties.locationCode.toString(),
						locationName: properties.name,
						group: group,
						coordinates: { x: feature.geometry.coordinates[0], y: feature.geometry.coordinates[1]},
						quantityData: quantityData,
						directionData: directionData,
						labelData: labelData
					}

					dataInput.push(input);
				}

			});

			console.log(dataInput);

		});

	}

	private getParameterById() {

	}

}
