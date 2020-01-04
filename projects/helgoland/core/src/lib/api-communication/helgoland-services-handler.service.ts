import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { combineLatest, Observable, Observer } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Category } from '../model/dataset-api/category';
import { Offering } from '../model/dataset-api/offering';
import { Phenomenon } from '../model/dataset-api/phenomenon';
import { Service } from '../model/dataset-api/service';
import { Station } from '../model/dataset-api/station';
import { ParameterFilter } from '../model/internal/http-requests';
import { IHelgolandServiceConnector, IHelgolandServiceConnectorHandler } from './interfaces/service-handler.interface';
import { Procedure } from '../model/dataset-api/procedure';

export const HELGOLAND_SERVICE_CONNECTOR_HANDLER = new InjectionToken<IHelgolandServiceConnectorHandler>('HELGOLAND_SERVICE_CONNECTOR_HANDLER');

@Injectable({
  providedIn: 'root'
})
export class HelgolandServicesHandlerService implements IHelgolandServiceConnector {

  private serviceMapping: Map<string, IHelgolandServiceConnectorHandler> = new Map();

  constructor(
    @Optional() @Inject(HELGOLAND_SERVICE_CONNECTOR_HANDLER) protected handler: IHelgolandServiceConnectorHandler[] | null
  ) { }

  public getServices(url: string, filter: ParameterFilter = {}): Observable<Service[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getServices(url, filter)));
  }

  public getCategories(url: string, filter: ParameterFilter = {}): Observable<Category[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getCategories(url, filter)));
  }

  public getCategory(id: string, url: string, filter: ParameterFilter = {}): Observable<Category> {
    return this.getHandler(url).pipe(flatMap(h => h.getCategory(id, url, filter)));
  }

  public getOfferings(url: string, filter: ParameterFilter = {}): Observable<Offering[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getOfferings(url, filter)));
  }

  public getOffering(id: string, url: string, filter: ParameterFilter = {}): Observable<Offering> {
    return this.getHandler(url).pipe(flatMap(h => h.getOffering(id, url, filter)));
  }

  public getPhenomena(url: string, filter: ParameterFilter = {}): Observable<Phenomenon[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getPhenomena(url, filter)));
  }

  public getPhenomenon(id: string, url: string, filter: ParameterFilter = {}): Observable<Phenomenon> {
    return this.getHandler(url).pipe(flatMap(h => h.getPhenomenon(id, url, filter)));
  }

  public getProcedures(url: string, filter: ParameterFilter = {}): Observable<Procedure[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getProcedures(url, filter)));
  }

  public getProcedure(id: string, url: string, filter: ParameterFilter = {}): Observable<Procedure> {
    return this.getHandler(url).pipe(flatMap(h => h.getProcedure(id, url, filter)));
  }

  public getStations(url: string, filter: ParameterFilter = {}): Observable<Station[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getStations(url, filter)));
  }

  public getStation(id: string, url: string, filter: ParameterFilter = {}): Observable<Station> {
    return this.getHandler(url).pipe(flatMap(h => h.getStation(id, url, filter)));
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
