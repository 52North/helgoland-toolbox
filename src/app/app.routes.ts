import { Routes } from '@angular/router';

import { AdditionalDataGraphComponent } from './pages/additional-data-graph/additional-data-graph.component';
import { DiagramExportComponent } from './pages/diagram-export/diagram-export.component';
import { EventingComponent } from './pages/eventing/eventing.component';
import { FacetSearchComponent } from './pages/facet-search/facet-search.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { GraphLegendComponent } from './pages/graph-legend/graph-legend.component';
import { ListSelectionComponent } from './pages/list-selection/list-selection.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { MapViewComponent } from './pages/map-view/map-view.component';
import { OlComponent } from './pages/ol/ol.component';
import { PermalinkComponent } from './pages/permalink/permalink.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProfileEntryComponent } from './pages/profile-entry/profile-entry.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';
import { SensormlComponent } from './pages/sensorml/sensorml.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';
import { ServiceSelectorComponent } from './pages/service-selector/service-selector.component';
import { TableComponent } from './pages/table/table.component';
import { TimeComponent } from './pages/time/time.component';
import { TimeseriesGraphComponent } from './pages/timeseries-graph/timeseries-graph.component';
import { TrajectoryComponent } from './pages/trajectory/trajectory.component';

export const ROUTES: Routes = [
  { path: 'eventing', component: EventingComponent },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'graph-legend', component: GraphLegendComponent },
  { path: 'additional-data-graph', component: AdditionalDataGraphComponent },
  { path: 'list-selection', component: ListSelectionComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  { path: 'map-view', component: MapViewComponent },
  { path: 'permalink', component: PermalinkComponent },
  { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'profile-entry', component: ProfileEntryComponent },
  { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent },
  { path: 'service-selector', component: ServiceSelectorComponent },
  { path: 'table', component: TableComponent },
  { path: 'time', component: TimeComponent },
  { path: 'timeseries-graph', component: TimeseriesGraphComponent },
  { path: 'trajectory', component: TrajectoryComponent },
  { path: 'ol', component: OlComponent },
  { path: 'diagram-export', component: DiagramExportComponent },
  { path: 'facet-search', component: FacetSearchComponent },
  { path: 'sensorml', component: SensormlComponent },
  { path: 'sandbox', component: SandboxComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
