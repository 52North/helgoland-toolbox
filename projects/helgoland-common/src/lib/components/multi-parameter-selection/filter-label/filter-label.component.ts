import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ParameterType } from '../model';

@Component({
  selector: 'helgoland-common-parameter-type-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss'],
  imports: [TranslateModule],
})
export class FilterLabelComponent {
  readonly filter = input<ParameterType>();
}
