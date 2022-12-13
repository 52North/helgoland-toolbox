import { Routes } from '@angular/router';

import { DiagramViewComponent } from './views/diagram-view/diagram-view.component';

export const ROUTES: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    component: DiagramViewComponent
  }
];
