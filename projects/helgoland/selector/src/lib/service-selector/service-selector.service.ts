import { Injectable } from '@angular/core';
import { BlacklistedService, HelgolandServicesHandlerService, ParameterFilter, Service } from '@helgoland/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class ServiceSelectorService {

    constructor(
        protected servicesHandler: HelgolandServicesHandlerService
    ) { }

    public fetchServicesOfAPI(
        url: string,
        blacklist: BlacklistedService[],
        filter: ParameterFilter
    ): Observable<Service[]> {
        return new Observable<Service[]>((observer: Observer<Service[]>) => {
            this.servicesHandler.getServices(url, filter)
                .subscribe(
                    (services) => {
                        if (services && services instanceof Array) {
                            const usableServices = services.filter((service) => !this.isServiceBlacklisted(service.id, url, blacklist));
                            observer.next(usableServices);
                            observer.complete();
                        }
                    },
                    (error) => {
                        observer.error(error);
                        observer.complete();
                    });
        });
    }

    private isServiceBlacklisted(serviceID: string, url: string, blacklist: BlacklistedService[]): boolean {
        let isBlacklisted = false;
        blacklist.forEach((entry) => {
            if (entry.serviceId === serviceID && entry.apiUrl === url) {
                isBlacklisted = true;
            }
        });
        return isBlacklisted;
    }
}
