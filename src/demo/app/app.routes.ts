import { Routes } from '@angular/router';
import { ListSelectionComponent } from 'demo/app/pages/list-selection/list-selection.component';
import { ProviderSelectorComponent } from 'demo/app/pages/provider-selector/provider-selector.component';

export const ROUTES: Routes = [
  { path: 'provider-selector', component: ProviderSelectorComponent },
  // { path: 'map-selector', component: MapSelectorComponent },
  // { path: 'plotly-graph', component: PlotlyGraphComponent },
  // { path: 'flot-graph', component: FlotGraphComponent },
  // { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent },
  // { path: 'profile-entry', component: ProfileEntryComponent },
  // { path: 'graph-legend', component: GraphLegendComponent },
  // { path: 'time', component: TimeComponent },
  // { path: 'trajectory', component: TrajectoryComponent },
  // { path: 'permalink', component: PermalinkComponent },
  // { path: 'table', component: TableComponent },
  // { path: 'favorite', component: FavoriteComponent },
  { path: 'list-selection', component: ListSelectionComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
