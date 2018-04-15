import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

import { MapService } from '../../../leaflet/map/service/map.service';
import { WaterinfoGroup, WaterinfoParameter, WaterinfoProperties, WaterinfoLatestMeasurement, WaterinfoMatDataSource } from '../../model/waterinfo';
import { WaterinfoService } from '../../service/waterinfo.service';

import { MatTableDataSource, MatProgressSpinner } from '@angular/material'



@Component({
	selector: 'app-waterinfo-raw',
	templateUrl: './waterinfo-raw.component.html',
	styleUrls: ['./waterinfo-raw.component.css']
})
export class WaterinfoRawComponent implements OnInit {
	
	isLoaded = false;
	dataSource = new MatTableDataSource<WaterinfoMatDataSource>();
	displayedColumns = ["locationName", "parameterName", "datetime", "value", "unit"];
	rowSelected: WaterinfoMatDataSource;
	waterinfoUrl: string;

	private allParameters: WaterinfoParameter[] = [];
	private locations: {[locationCode: number]: string} = {};
	
	private leadGroupName = "golven";

	constructor(private waterinfoService: WaterinfoService) { 
		//TODO for iframe: https://stackoverflow.com/questions/38037760/how-to-set-iframe-src-in-angular-2-without-causing-unsafe-value-exception
	}

	ngOnInit() {
		this.isLoaded = false;
		this.waterinfoService.getLatestAsMatTableData(["golven", "wind", "watertemperatuur"])
		.subscribe((data) => {
			this.dataSource.data = data
			.sort((a, b) => {
				if(a.locationName < b.locationName) return -1;
				if(a.locationName > b.locationName) return 1;
				if(a.parameterId < b.parameterId) return -1;
				if(a.parameterId > b.parameterId) return 1;
				return 0;
			});
			
			this.isLoaded = true;
		});
	}
	
	getGroupData(group: WaterinfoGroup) {
		if(!group) {
			return;
		}

		this.waterinfoService.getLatest(group.parameters.map(par => par.slug))
		.subscribe(data => {
			console.log(data);
		});
	}

	getLocationName(locationCode: number) {
		return this.locations[locationCode];
	}

	onRowClicked(row: WaterinfoMatDataSource) {
		const waterinfoUrl  = `https://waterinfo.rws.nl/#!/details/expert/Golven/${row.locationCode}/${row.parameterId}`;
		window.open(waterinfoUrl, "_blank");
		this.rowSelected = row;	
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}

}
