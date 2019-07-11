import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { IdCache } from '@helgoland/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

export const LABEL_MAPPER_HANDLER = new InjectionToken<LabelMapperHandler>('LABEL_MAPPER_HANDLER');

export interface LabelMapperHandler {
  canHandle(label: string): boolean;
  getMappedLabel(label: string): Observable<string>;
}

@Injectable({
  providedIn: 'root'
})
export class LabelMapperService {

  private cache: IdCache<string> = new IdCache();

  constructor(
    @Optional() @Inject(LABEL_MAPPER_HANDLER) protected handler: LabelMapperHandler[] | null
  ) { }

  public getMappedLabel(label: string): Observable<string> {
    if (this.cache.has(label)) {
      return of(this.cache.get(label));
    }
    if (this.handler) {
      for (let i = 0; i < this.handler.length; i++) {
        const h = this.handler[i];
        if (h.canHandle(label)) {
          return h.getMappedLabel(label).pipe(tap(mapped => this.cache.set(label, mapped)));
        }
      }
    }
    return this.defaultLabel(label);
  }

  private defaultLabel(label: string): Observable<string> {
    this.cache.set(label, label);
    return of(label);
  }
}
