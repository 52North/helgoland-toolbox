import { Pipe, PipeTransform } from '@angular/core';

import { FacetParameter } from '../facet-search-model';

@Pipe({
  name: 'matchFacetParameterLabel'
})
export class MatchFacetParameterLabelPipe implements PipeTransform {

  transform(value: FacetParameter[], args?: string): FacetParameter[] {
    if (value && args) {
      return value.filter(e => e.label.toLowerCase().indexOf(args.toLocaleLowerCase()) >= 0);
    }
    return value;
  }

}
