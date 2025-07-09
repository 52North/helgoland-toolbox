import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'eventing',
    loadComponent: () =>
      import('./pages/eventing/eventing.component').then(
        (m) => m.EventingComponent,
      ),
  },
  {
    path: 'favorite',
    loadComponent: () =>
      import('./pages/favorite/favorite.component').then(
        (m) => m.FavoriteComponent,
      ),
  },
  {
    path: 'graph-legend',
    loadComponent: () =>
      import('./pages/graph-legend/graph-legend.component').then(
        (m) => m.GraphLegendComponent,
      ),
  },
  {
    path: 'list-selection',
    loadComponent: () =>
      import('./pages/list-selection/list-selection.component').then(
        (m) => m.ListSelectionComponent,
      ),
  },
  {
    path: 'map-selector',
    loadComponent: () =>
      import('./pages/map-selector/map-selector.component').then(
        (m) => m.MapSelectorComponent,
      ),
  },
  {
    path: 'map-view',
    loadComponent: () =>
      import('./pages/map-view/map-view.component').then(
        (m) => m.MapViewComponent,
      ),
  },
  {
    path: 'permalink',
    loadComponent: () =>
      import('./pages/permalink/permalink.component').then(
        (m) => m.PermalinkComponent,
      ),
  },
  {
    path: 'profile-entry',
    loadComponent: () =>
      import('./pages/profile-entry/profile-entry.component').then(
        (m) => m.ProfileEntryComponent,
      ),
  },
  {
    path: 'service-filter-selector',
    loadComponent: () =>
      import(
        './pages/service-filter-selector/service-filter-selector.component'
      ).then((m) => m.ServiceFilterSelectorDemoPageComponent),
  },
  {
    path: 'service-selector',
    loadComponent: () =>
      import('./pages/service-selector/service-selector.component').then(
        (m) => m.ServiceSelectorComponent,
      ),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./pages/table/table.component').then((m) => m.TableComponent),
  },
  {
    path: 'time',
    loadComponent: () =>
      import('./pages/time/time.component').then((m) => m.TimeComponent),
  },
  {
    path: 'timeseries-graph',
    loadComponent: () =>
      import('./pages/timeseries-graph/timeseries-graph.component').then(
        (m) => m.TimeseriesGraphComponent,
      ),
  },
  {
    path: 'trajectory',
    loadComponent: () =>
      import('./pages/trajectory/trajectory.component').then(
        (m) => m.TrajectoryComponent,
      ),
  },
  {
    path: 'ol',
    loadComponent: () =>
      import('./pages/ol/ol.component').then((m) => m.OlComponent),
  },
  {
    path: 'diagram-export',
    loadComponent: () =>
      import('./pages/diagram-export/diagram-export.component').then(
        (m) => m.DiagramExportComponent,
      ),
  },
  {
    path: 'facet-search',
    loadComponent: () =>
      import('./pages/facet-search/facet-search.component').then(
        (m) => m.FacetSearchComponent,
      ),
  },
  {
    path: 'sensorml',
    loadComponent: () =>
      import('./pages/sensorml/sensorml.component').then(
        (m) => m.SensormlComponent,
      ),
  },
  {
    path: 'sandbox',
    loadComponent: () =>
      import('./pages/sandbox/sandbox.component').then(
        (m) => m.SandboxComponent,
      ),
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
