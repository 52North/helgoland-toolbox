import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ParameterType } from "helgoland-common";
import { Required } from "../../../../../../helgoland/core/src/public-api";

@Component({
  selector: "helgoland-trajectories-parameter-type-label",
  templateUrl: "./parameter-type-label.component.html",
  styleUrls: ["./parameter-type-label.component.scss"],
  imports: [
    CommonModule,
    TranslateModule
  ],
  standalone: true
})
export class ParameterTypeLabelComponent {

  @Input()
  @Required
    parameterType!: ParameterType

}
