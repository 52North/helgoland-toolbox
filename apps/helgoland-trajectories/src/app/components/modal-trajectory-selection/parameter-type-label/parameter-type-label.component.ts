import { Component, Input } from '@angular/core';

import {
  ParameterType,
} from '../../../../../../../libs/helgoland-common/src/lib/components/multi-parameter-selection/model';

@Component({
  selector: 'helgoland-trajectories-parameter-type-label',
  templateUrl: './parameter-type-label.component.html',
  styleUrls: ['./parameter-type-label.component.scss']
})
export class ParameterTypeLabelComponent {

  @Input() parameterType: ParameterType

}
