import { Routes } from '@angular/router';
import { FavoriteComponent } from 'demo/app/pages/favorite/favorite.component';
import { FlotGraphComponent } from 'demo/app/pages/flot-graph/flot-graph.component';
import { GraphLegendComponent } from 'demo/app/pages/graph-legend/graph-legend.component';
import { ListSelectionComponent } from 'demo/app/pages/list-selection/list-selection.component';
import { MapSelectorComponent } from 'demo/app/pages/map-selector/map-selector.component';
import { PermalinkComponent } from 'demo/app/pages/permalink/permalink.component';
import { ProfileEntryComponent } from 'demo/app/pages/profile-entry/profile-entry.component';
import { ProviderSelectorComponent } from 'demo/app/pages/provider-selector/provider-selector.component';
import {
  ServiceFilterSelectorDemoPageComponent,
} from 'demo/app/pages/service-filter-selector/service-filter-selector.component';
import { TimeComponent } from 'demo/app/pages/time/time.component';
import { TrajectoryComponent } from 'demo/app/pages/trajectory/trajectory.component';

export const ROUTES: Routes = [
  { path: 'provider-selector', component: ProviderSelectorComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  // { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'flot-graph', component: FlotGraphComponent },
  { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent },
  { path: 'profile-entry', component: ProfileEntryComponent },
  { path: 'graph-legend', component: GraphLegendComponent },
  { path: 'time', component: TimeComponent },
  { path: 'trajectory', component: TrajectoryComponent },
  { path: 'permalink', component: PermalinkComponent },
  // { path: 'table', component: TableComponent },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'list-selection', component: ListSelectionComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
