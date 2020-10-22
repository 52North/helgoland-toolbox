import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export const MAP_SELECTION_ROUTE = 'map-selection';
export const LIST_SELECTION_ROUTE = 'list-selection';
export const FAVORITES_ROUTE = 'favorites';

@Injectable({
  providedIn: 'root'
})
export class AppRouterService {

  constructor(
    private router: Router
  ) { }

  public toDiagram() {
    this.router.navigate([''])
  }

  public toMapSelection() {
    this.router.navigate([MAP_SELECTION_ROUTE])
  }

  public toListSelection() {
    this.router.navigate([LIST_SELECTION_ROUTE])
  }

  public toFavoriteList() {
    this.router.navigate([FAVORITES_ROUTE])
  }

}
