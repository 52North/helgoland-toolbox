import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ParameterType } from 'helgoland-common';

@Component({
  selector: 'helgoland-trajectories-parameter-type-label',
  templateUrl: './parameter-type-label.component.html',
  styleUrls: ['./parameter-type-label.component.scss'],
  imports: [TranslateModule],
})
export class ParameterTypeLabelComponent {
  readonly parameterType = input.required<ParameterType>();
}
