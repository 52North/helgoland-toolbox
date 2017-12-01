import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { IdCache } from '../../../model/internal/id-cache';
import { Settings } from '../../../model/settings/settings';
import { SettingsService } from '../../../services/settings/settings.service';

declare var $: any;

@Injectable()
export class LabelMapperService {

    private cache: IdCache<string> = new IdCache();

    constructor(
        private httpClient: HttpClient,
        private settingsSrvc: SettingsService<Settings>
    ) { }

    public getMappedLabel(label: string): Observable<string> {
        return new Observable<string>((observer: Observer<string>) => {
            if (!this.settingsSrvc.getSettings().solveLabels) {
                this.confirmLabel(observer, label);
            } else {
                const url = this.findUrl(label);
                if (url) {
                    if (this.cache.has(url)) {
                        this.confirmLabel(observer, this.cache.get(url));
                    } else {
                        const labelUrl =
                            this.settingsSrvc.getSettings().proxyUrl ? this.settingsSrvc.getSettings().proxyUrl + url : url;
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
