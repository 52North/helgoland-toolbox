import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { ParameterFacetComponent } from './components/parameter-facet/parameter-facet.component';
import { ResultListComponent } from './components/result-list/result-list.component';
import { ResultMapComponent } from './components/result-map/result-map.component';
import { FacetSearchService } from './facet-search-model';
import { FacetSearchServiceImpl } from './facet-search.service';

const COMPONENTS = [
  ParameterFacetComponent,
  ResultListComponent,
  ResultMapComponent,
];

/**
 * The facet-search module includes the following functionality:
 * - facet search with service and components
 * - result list compoent
 * - result map component
 * - parameter list facet
 */
@NgModule({
  imports: [
    CommonModule,
    HelgolandCoreModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS],
  providers: [
    {
      provide: FacetSearchService,
      useClass: FacetSearchServiceImpl
    }
  ]
})
export class HelgolandFacetSearchModule { }
