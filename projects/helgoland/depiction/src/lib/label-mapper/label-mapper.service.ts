import { Injectable, InjectionToken, inject } from '@angular/core';
import { IdCache } from '@helgoland/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const LABEL_MAPPER_HANDLER = new InjectionToken<LabelMapperHandler[]>(
  'LABEL_MAPPER_HANDLER',
);

export interface LabelMapperHandler {
  canHandle(label: string): boolean;
  getMappedLabel(label: string): Observable<string>;
}

@Injectable({
  providedIn: 'root',
})
export class LabelMapperService {
  protected handler = inject(LABEL_MAPPER_HANDLER, { optional: true });

  private cache: IdCache<string> = new IdCache();

  public getMappedLabel(label: string): Observable<string> {
    const chachedLabel = this.cache.get(label);
    if (chachedLabel) {
      return of(chachedLabel);
    }
    if (this.handler) {
      for (let i = 0; i < this.handler.length; i++) {
        const h = this.handler[i];
        if (h.canHandle(label)) {
          return h
            .getMappedLabel(label)
            .pipe(tap((mapped) => this.cache.set(label, mapped)));
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
