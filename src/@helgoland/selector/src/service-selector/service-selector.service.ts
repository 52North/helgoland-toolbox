import { Injectable } from '@angular/core';
import { ApiInterface } from '@helgoland/core';
import { Service } from '@helgoland/core';
import { BlacklistedService } from '@helgoland/core';
import { ParameterFilter } from '@helgoland/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class ServiceSelectorService {

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public fetchServicesOfAPI(
        url: string,
        blacklist: BlacklistedService[],
        filter: ParameterFilter
    ): Observable<Service[]> {
        return new Observable<Service[]>((observer: Observer<Service[]>) => {
            this.apiInterface.getServices(url, filter)
                .subscribe((services) => {
                    if (services && services instanceof Array) {
                        const usableServices = services.map((service) => {
                            if (!this.isServiceBlacklisted(service.id, url, blacklist)) {
                                return service;
                            }
                        });
                        observer.next(usableServices);
                        observer.complete();
                    }
                }, (error) => {
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
