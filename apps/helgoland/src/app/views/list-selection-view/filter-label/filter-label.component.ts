import { Component, Input } from '@angular/core';

import { Filter } from '../list-selection-view.component';

@Component({
  selector: 'helgoland-toolbox-filter-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss']
})
export class FilterLabelComponent {

  @Input() filter: Filter;

}
