import { Component } from "@angular/core";
import { HelgolandCoreModule } from "@helgoland/core";
import { TranslateModule } from "@ngx-translate/core";

import { versions } from "./../../../../../../versions";

@Component({
  selector: "helgoland-common-version-info",
  templateUrl: "./version-info.component.html",
  styleUrls: ["./version-info.component.scss"],
  imports: [
    TranslateModule,
    HelgolandCoreModule
  ],
  standalone: true
})
export class VersionInfoComponent {

  public versions = versions;

}
