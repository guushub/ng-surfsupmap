import { Component, OnInit } from '@angular/core';
import { WaterinfoService } from '../../service/waterinfo.service';
import { MatProgressSpinner } from '@angular/material'

@Component({
  selector: 'app-waterinfo-loading',
  templateUrl: './waterinfo-loading.component.html',
  styleUrls: ['./waterinfo-loading.component.css']
})
export class WaterinfoLoadingComponent implements OnInit {
  visible: boolean = false;

  constructor(private waterinfoService: WaterinfoService) { }

  ngOnInit() {
    this.waterinfoService.isCurrentlyLoading.subscribe(isLoading => {
      this.visible = isLoading
    });
  }

}
