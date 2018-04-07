import { Component, OnInit } from '@angular/core';
import { SurfsupMapLayerService } from '../../services/layer/surfsup-map-layer.service';
import { WaterinfoService, WaterinfoGroup, WaterinfoParameter } from '../../services/waterinfo/waterinfo.service';
import * as SurfsupMapTheme from "../../surfsup-map/surfsup-map-theme";

interface SurfsupMapFormInput {
  parameter: WaterinfoParameter;
  
}

@Component({
  selector: 'app-surfsup-map-layer-add',
  templateUrl: './surfsup-map-layer-add.component.html',
  styleUrls: ['./surfsup-map-layer-add.component.css']
})
export class SurfsupMapLayerAddComponent implements OnInit {
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
      case "s":
        return SurfsupMapTheme.ThemeType.s;
      default:
        return SurfsupMapTheme.ThemeType["m/s"];
      
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

}
