import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export const MAP_SELECTION_ROUTE = 'map-selection';

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
    this.router.navigate(['map-selection'])
  }

}
