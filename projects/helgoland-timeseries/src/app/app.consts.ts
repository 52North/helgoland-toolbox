import { Routes } from "@angular/router";
import { icon, Marker } from "leaflet";

import { DiagramViewComponent } from "./views/diagram-view/diagram-view.component";

export const ROUTES: Routes = [
  {
    path: "**",
    pathMatch: "full",
    component: DiagramViewComponent
  }
];


Marker.prototype.options.icon = icon({
  iconRetinaUrl: "assets/img/marker-icon-2x.png",
  iconUrl: "assets/img/marker-icon.png",
  shadowUrl: "assets/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});