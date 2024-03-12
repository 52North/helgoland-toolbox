import { Component } from "@angular/core";

import { MapCache } from "../../base/map-cache.service";
import { MapControlComponent } from "../map-control-component";
import { LocateService } from "./locate.service";
import { NgClass } from "@angular/common";

@Component({
  selector: "n52-locate-control",
  templateUrl: "./locate.component.html",
  styleUrls: ["./locate.component.scss"],
  standalone: true,
  imports: [NgClass]
})
export class LocateControlComponent extends MapControlComponent {

  public isToggled = false;

  constructor(
        protected locateService: LocateService,
        protected override mapCache: MapCache
  ) {
    super(mapCache);
  }

  public locateUser() {
    this.isToggled = !this.isToggled;
    if (this.isToggled) {
      this.locateService.startLocate(this.mapId);
    } else {
      this.locateService.stopLocate(this.mapId);
    }
  }
}
