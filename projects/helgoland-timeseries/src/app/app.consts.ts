import { MatSnackBarConfig } from '@angular/material/snack-bar';

import { LIST_SELECTION_ROUTE, MAP_SELECTION_ROUTE } from './services/app-router.service';
import { DiagramViewComponent } from './views/diagram-view/diagram-view.component';
import { ListSelectionViewComponent } from './views/list-selection-view/list-selection-view.component';
import { MapSelectionViewComponent } from './views/map-selection-view/map-selection-view.component';

export const ROUTES = [
  {
    path: MAP_SELECTION_ROUTE,
    component: MapSelectionViewComponent
  },
  {
    path: LIST_SELECTION_ROUTE,
    component: ListSelectionViewComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: DiagramViewComponent
  }
];

export const SNACK_BAR_CONFIG: MatSnackBarConfig = {
  duration: 2000,
  verticalPosition: 'bottom',
  horizontalPosition: 'center'
};
