import { Injectable } from '@angular/core';
import {
  BlacklistedService,
  HelgolandParameterFilter,
  HelgolandService,
  HelgolandServicesConnector,
} from '@helgoland/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class ServiceSelectorService {
  constructor(protected servicesConnector: HelgolandServicesConnector) {}

  public fetchServicesOfAPI(
    url: string,
    blacklist: BlacklistedService[],
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandService[]> {
    return new Observable<HelgolandService[]>(
      (observer: Observer<HelgolandService[]>) => {
        this.servicesConnector.getServices(url, filter).subscribe({
          next: (services) => {
            if (services && services instanceof Array) {
              const usableServices = services.filter(
                (service) =>
                  !this.isServiceBlacklisted(service.id, url, blacklist),
              );
              observer.next(usableServices);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
            observer.complete();
          },
        });
      },
    );
  }

  private isServiceBlacklisted(
    serviceID: string,
    url: string,
    blacklist: BlacklistedService[],
  ): boolean {
    let isBlacklisted = false;
    blacklist.forEach((entry) => {
      if (entry.serviceId === serviceID && entry.apiUrl === url) {
        isBlacklisted = true;
      }
    });
    return isBlacklisted;
  }
}
