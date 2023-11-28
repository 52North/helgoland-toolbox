import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import { ParameterType } from "../model";


@Component({
  selector: 'helgoland-common-parameter-type-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss'],
  imports: [
    TranslateModule,
    CommonModule
  ],
  standalone: true
})
export class FilterLabelComponent {

  @Input() filter: ParameterType | undefined;

}
