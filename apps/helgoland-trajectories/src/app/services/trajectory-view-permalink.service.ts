import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermalinkService } from '@helgoland/permalink';
import { Observable, Observer } from 'rxjs';

import { TrajectoriesService } from './trajectories.service';

const PARAM_ID = 'id';

@Injectable({
  providedIn: 'root'
})
export class TrajectoryViewPermalinkService extends PermalinkService<Observable<void>> {

  constructor(
    private trajectorySrvc: TrajectoriesService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  public validatePeramlink(): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params[PARAM_ID]) {
          const id = params[PARAM_ID] as string;
          this.trajectorySrvc.addDataset(id);
        }
        observer.next();
        observer.complete();
      });
    });
  }

  protected generatePermalink(): string {
    let paramUrl = '';
    if (this.trajectorySrvc.mainTrajectoryId) {
      paramUrl = this.createBaseUrl() + '?' + PARAM_ID + '=' + encodeURIComponent(this.trajectorySrvc.mainTrajectoryId);
    } else {
      paramUrl = this.createBaseUrl();
    }
    console.log(paramUrl);
    return paramUrl;
  }

}
