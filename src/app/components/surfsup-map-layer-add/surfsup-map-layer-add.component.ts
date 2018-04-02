import { Component, OnInit } from '@angular/core';
import { SurfsupMapLayerService } from '../../services/layer/surfsup-map-layer.service';
import { WaterinfoService, WaterinfoGroup, WaterinfoParameter } from '../../services/waterinfo/waterinfo.service';
import * as SurfsupMapTheme from "../../surfsup-map/surfsup-map-theme";


@Component({
  selector: 'app-surfsup-map-layer-add',
  templateUrl: './surfsup-map-layer-add.component.html',
  styleUrls: ['./surfsup-map-layer-add.component.css']
})
export class SurfsupMapLayerAddComponent implements OnInit {
  private active: boolean;
  private step: number;
  private canAdd = false;

  private waterinfoGroups: WaterinfoGroup[] = [];
  private waterinfoGroupSelected: WaterinfoGroup;

  private quantityPar: WaterinfoParameter;
  private directionPar: WaterinfoParameter;
  private labelPar: WaterinfoParameter;

  constructor(private waterinfoService: WaterinfoService, private surfsupMapLayerService: SurfsupMapLayerService) { }

  ngOnInit() {
    this.waterinfoService.getGroups()
    .subscribe(groups => {
      this.waterinfoGroups = groups;
    })
    this.active = false;
    this.step = 1;
  }

  addLayer() {
    //
    if(this.canAdd) {
      this.waterinfoService.getLatestAsSurfsupMapData(
        this.waterinfoGroupSelected.slug,
        this.quantityPar.slug,
        this.directionPar.slug,
        this.labelPar.slug
      )
      .subscribe((points) => {
        const symbology = SurfsupMapTheme.getSymbologyByTheme(
          SurfsupMapTheme.ThemeType.cm,
          SurfsupMapTheme.ThemeColor.purple
        )

        const legendText = points[0].properties.data.quantity.parameter.name;
        this.surfsupMapLayerService.addLayer(points, symbology, legendText);
      });
    }
  }

  private directionParameters() {
    return this.waterinfoGroupSelected.parameters.filter(par => {
      const splitted = par.slug.split("___20");
      const unit = splitted ? splitted[splitted.length - 1] : "";
      if(unit === "graad") {
        return par;
      }
    });
  }

  private quantityParameters() {
    return this.waterinfoGroupSelected.parameters.filter(par => {
      const splitted = par.slug.split("___20");
      const unit = splitted ? splitted[splitted.length - 1] : "";
      if(unit !== "graad") {
        return par;
      }
    });
  }

  private onWaterinfoGroupSelect(waterinfoGroupSelected: WaterinfoGroup) {
    this.waterinfoGroupSelected = waterinfoGroupSelected;
    this.next();
  }

  private selectQuantityPar(parameter: WaterinfoParameter) {
    this.quantityPar = parameter;
    this.next();
  }

  private selectDirectionPar(parameter: WaterinfoParameter) {
    this.directionPar = parameter;
    this.next();
  }

  private selectLabelPar(parameter: WaterinfoParameter) {
    this.labelPar = parameter;
    this.next();
  }

  private back() {
    if(this.step > 1) this.step -= 1;
  }

  private next() {
    if(this.quantityPar && this.directionPar && this.labelPar) {
      this.canAdd = true;
    }
    this.step += 1;
  }

  private clear() {

  }

}
