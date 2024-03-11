import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

import { ListSelectionComponent } from '../components/list-selection/list-selection.component';
import { MapSelectionComponent } from './../components/map-selection/map-selection.component';

export const MAP_SELECTION_ROUTE = 'map-selection';
export const LIST_SELECTION_ROUTE = 'list-selection';

@Injectable({
  providedIn: 'root',
})
export class AppRouterService {

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (val.url.indexOf(LIST_SELECTION_ROUTE) > -1) {
          this.openListSelection();
        }
        if (val.url.indexOf(MAP_SELECTION_ROUTE) > -1) {
          this.openMapSelection();
        }
      };
    })
  }

  public toDiagram() {
    this.router.navigate([''])
  }

  public toMapSelection() {
    if (this.router.url.indexOf(LIST_SELECTION_ROUTE) === -1) {
      this.router.navigate([MAP_SELECTION_ROUTE]);
    }
  }

  public toListSelection() {
    if (this.router.url.indexOf(MAP_SELECTION_ROUTE) === -1) {
      this.router.navigate([LIST_SELECTION_ROUTE]);
    }
  }

  public resetNavigation() {
    this.router.navigate(['']);
  }

  private openMapSelection() {
    const dialogRef = this.dialog.open(MapSelectionComponent, {
      autoFocus: false,
      panelClass: 'modal-map-selection'
    });
    dialogRef.afterClosed().subscribe(res => this.resetNavigation());
  }

  private openListSelection() {
    const dialogRef = this.dialog.open(ListSelectionComponent, {
      autoFocus: false,
      minWidth: '600px'
    });
    dialogRef.afterClosed().subscribe(res => this.resetNavigation());
  }

}
