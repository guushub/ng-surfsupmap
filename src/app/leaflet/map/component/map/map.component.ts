import { Component, OnInit } from '@angular/core';
import { MapService } from '../../service/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  hideMap = false;
  
  constructor(private mapService: MapService) { 
    this.mapService.hide.subscribe(hide => {
      this.hideMap = hide;
    });
  }

  ngOnInit() {
    this.mapService.setMap("map");
  }

}
