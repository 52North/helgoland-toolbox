import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ParameterFacetComponent } from './components/parameter-facet/parameter-facet.component';
import { ResultListComponent } from './components/result-list/result-list.component';
import { ResultMapComponent } from './components/result-map/result-map.component';
import { MatchFacetParameterLabelPipe } from './pipes/match-facet-parameter-label.pipe';

const COMPONENTS = [
  ParameterFacetComponent,
  ResultListComponent,
  ResultMapComponent,
  MatchFacetParameterLabelPipe
];

@NgModule({
  imports: [CommonModule],
  declarations: [COMPONENTS],
  exports: [COMPONENTS]
})
export class HelgolandFacetSearchModule { }
