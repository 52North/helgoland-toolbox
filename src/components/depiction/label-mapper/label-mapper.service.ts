import { Map } from 'rxjs/util/Map';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { Settings } from '../../../services/settings/settings';

declare var $: any;

@Injectable()
export class LabelMapperService {

    private cache: Map<string, string> = new Map();

    constructor(
        private httpClient: HttpClient,
        private settings: Settings
    ) { }

    public getMappedLabel(label: string): Observable<string> {
        return new Observable<string>((observer: Observer<string>) => {
            if (!this.settings.config.solveLabels) {
                this.confirmLabel(observer, label);
            } else {
                const url = this.findUrl(label);
                if (url) {
                    if (this.cache.has(url)) {
                        this.confirmLabel(observer, this.cache.get(url));
                    } else {
                        const labelUrl = this.settings.config.proxyUrl ? this.settings.config.proxyUrl + url : url;
                        this.httpClient.get(labelUrl, { responseType: 'text' }).subscribe((res) => {
                            try {
                                const xml = $.parseXML(res);
                                label = label.replace(url, $(xml).find('prefLabel').text());
                            } catch (error) {
                                // currently do nothing and use old label
                            }
                            this.cache.set(url, label);
                            this.confirmLabel(observer, label);
                        }, (error) => {
                            const resolvedLabel = label.substring(label.lastIndexOf('/') + 1, label.length);
                            this.cache.set(url, resolvedLabel);
                            this.confirmLabel(observer, resolvedLabel);
                        });
                    }
                } else {
                    this.confirmLabel(observer, label);
                }
            }
        });
    }

    private confirmLabel(observer: Observer<string>, label: string) {
        observer.next(label);
        observer.complete();
    }

    private findUrl(label: string) {
        const source = (label || '').toString();
        const regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?&\/\/=]+)/g;
        const matchArray = regexToken.exec(source);
        if (matchArray !== null) {
            return matchArray[0];
        }
        return null;
    }
}
