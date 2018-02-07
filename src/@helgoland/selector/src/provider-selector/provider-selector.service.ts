import { Injectable } from '@angular/core';
import { ApiInterface } from '@helgoland/core';
import { Service } from '@helgoland/core';
import { BlacklistedService } from '@helgoland/core';
import { ParameterFilter } from '@helgoland/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class ProviderSelectorService {

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public fetchProvidersOfAPI(
        url: string,
        blacklist: BlacklistedService[],
        filter: ParameterFilter
    ): Observable<Service[]> {
        return new Observable<Service[]>((observer: Observer<Service[]>) => {
            this.apiInterface.getServices(url, filter)
                .subscribe((providers) => {
                    if (providers && providers instanceof Array) {
                        const usableProviders = providers.map((provider) => {
                            if (!this.isServiceBlacklisted(provider.id, url, blacklist)) {
                                return provider;
                            }
                        });
                        observer.next(usableProviders);
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
