import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

import { MapService } from '../../../leaflet/map/service/map.service';
import { WaterinfoGroup, WaterinfoParameter, WaterinfoProperties, WaterinfoLatestMeasurement } from '../../model/waterinfo';
import { WaterinfoService } from '../../service/waterinfo.service';

@Component({
	selector: 'app-waterinfo-raw',
	templateUrl: './waterinfo-raw.component.html',
	styleUrls: ['./waterinfo-raw.component.css']
})
export class WaterinfoRawComponent implements OnInit {
	waterinfoGroups: WaterinfoGroup[] = [];
	surfsupMapGroupsAllowed = ["golven", "wind", "watertemperatuur"];
	locationData: { locationCode: number, locationName: string, measurements: WaterinfoLatestMeasurement[] }[] = [];
	isLoaded = false;
	isActive = false;

	private allParameters: WaterinfoParameter[] = [];
	private locations: {[locationCode: number]: string} = {};
	
	private leadGroupName = "golven";

	constructor(private mapService: MapService, private waterinfoService: WaterinfoService) { }

	ngOnInit() {
		this.mapService.hide.subscribe(hideMap => {
			this.isActive=hideMap;
		});

		this.waterinfoService.getGroups()
		.subscribe(groups => {
			this.isLoaded = false;
			this.locationData = [];

			this.waterinfoGroups = groups.filter(group => this.surfsupMapGroupsAllowed.indexOf(group.slug.toLowerCase()) > -1);
			const groupedParameters = this.waterinfoGroups.map(group => group.parameters);
			this.allParameters = [].concat(...this.waterinfoGroups.map(group => group.parameters)) as WaterinfoParameter[];

			const forkJoinInputs = groupedParameters.map(parameters => this.waterinfoService.getLatest(parameters.map(par => par.slug)));
			const combined: {[locationCode: number]: WaterinfoLatestMeasurement[]} = {};
			
			Observable.forkJoin(forkJoinInputs)
			.subscribe(collections => {
				let i = 0;
				collections.forEach(col => {
					const properties = col.features.map(feature => feature.properties) as WaterinfoProperties[]; 
					properties.forEach(prop => {
						const locationCode = prop.locationCode;
						const locationName = prop.name;
						const measurements = prop.measurements;

						if(i === 0 && !combined[locationCode]) {
							this.locations[locationCode] = locationName;
							combined[locationCode] = measurements;
						} else if(combined[locationCode]) {
							combined[locationCode] = combined[locationCode].concat(...measurements);
						}

						
					});
					i++;
				});

				for (const key in combined) {
					if (combined.hasOwnProperty(key)) {
						const locationCode = Number(key);
						const measurements = combined[locationCode];
						this.locationData.push({
							locationCode: Number(locationCode), 
							locationName: this.getLocationName(locationCode),
							measurements: measurements
						});
					}
				}

				this.locationData.sort((a, b) => {
					if(a.locationName < b.locationName) return -1;
					if(a.locationName > b.locationName) return 1;
					return 0;
				});
				this.isLoaded = true;

			});

		})


	}

	showMap() {
		this.mapService.hide.emit(false)
	}

	getGroupData(group: WaterinfoGroup) {
		if(!group) {
			return;
		}

		//const parameters = `parameterIds=${group.parameters.join(",parameterIds")}`;
		this.waterinfoService.getLatest(group.parameters.map(par => par.slug))
		.subscribe(data => {
			console.log(data);
		});
	}

	getParameterName(parameterId: string) {
		//const groupedParameters = [].concat(...this.waterinfoGroups.map(group => group.parameters)) as WaterinfoParameter[];
		const parameter = this.allParameters.find(par => par.slug === parameterId);
		return parameter.label;
	}
	

	getLocationName(locationCode: number) {
		return this.locations[locationCode];
	}

}
