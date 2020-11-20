import { Component, Input } from '@angular/core';

import { ParameterType } from '../model';


@Component({
  selector: 'helgoland-common-parameter-type-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss']
})
export class FilterLabelComponent {

  @Input() filter: ParameterType;

}
