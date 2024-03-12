import { Component } from "@angular/core";
import { HelgolandSelectorModule } from "@helgoland/selector";

@Component({
  templateUrl: "./service-filter-selector.component.html",
  styleUrls: ["./service-filter-selector.component.css"],
  imports: [
    HelgolandSelectorModule
  ],
  standalone: true
})
export class ServiceFilterSelectorDemoPageComponent { }
