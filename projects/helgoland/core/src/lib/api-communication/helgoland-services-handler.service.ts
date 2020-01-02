import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { combineLatest, Observable, Observer } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Station } from '../model/dataset-api/station';
import { ParameterFilter } from '../model/internal/http-requests';
import { IHelgolandServiceConnector, IHelgolandServiceConnectorHandler } from './interfaces/service-handler.interface';

export const HELGOLAND_SERVICE_CONNECTOR_HANDLER = new InjectionToken<IHelgolandServiceConnectorHandler>('HELGOLAND_SERVICE_CONNECTOR_HANDLER');

@Injectable({
  providedIn: 'root'
})
export class HelgolandServicesHandlerService implements IHelgolandServiceConnector {

  private serviceMapping: Map<string, IHelgolandServiceConnectorHandler> = new Map();

  constructor(
    @Optional() @Inject(HELGOLAND_SERVICE_CONNECTOR_HANDLER) protected handler: IHelgolandServiceConnectorHandler[] | null
  ) { }

  public getStations(url: string, filter: ParameterFilter = {}): Observable<Station[]> {
    return this.getHandler(url).pipe(flatMap(e => e.getStations(url, filter)));
  }

  public getStation(id: string, url: string, filter: ParameterFilter = {}): Observable<Station> {
    return this.getHandler(url).pipe(flatMap(e => e.getStation(id, url, filter)));
  }

  private getHandler(url: string): Observable<IHelgolandServiceConnectorHandler> {
    return new Observable<IHelgolandServiceConnectorHandler>((observer: Observer<IHelgolandServiceConnectorHandler>) => {
      if (this.serviceMapping.has(url)) {
        observer.next(this.serviceMapping.get(url));
        observer.complete();
        return;
      }
      const temp = this.handler.map(h => h.canHandle(url));
      combineLatest(temp).subscribe(res => {
        const idx = res.findIndex(e => e);
        if (idx >= 0) {
          const handler = this.handler[idx];
          this.serviceMapping.set(url, handler);
          console.log(`ConnectorHandler: ${url} works with ${handler.constructor.name}`);
          observer.next(handler);
          observer.complete();
        } else {
          console.log(`No ConnectorHandler found for ${url}`);
          observer.complete();
        }
      });
    });
  }

}
