import { Component, Input } from '@angular/core';

import {
  ParameterType,
} from 'helgoland-common';

@Component({
  selector: 'helgoland-trajectories-parameter-type-label',
  templateUrl: './parameter-type-label.component.html',
  styleUrls: ['./parameter-type-label.component.scss']
})
export class ParameterTypeLabelComponent {

  @Input() parameterType: ParameterType

}
