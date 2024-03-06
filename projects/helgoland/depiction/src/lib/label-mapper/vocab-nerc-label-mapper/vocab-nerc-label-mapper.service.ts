import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { Observable, Observer } from 'rxjs';

import { LabelMapperHandler } from './../label-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class VocabNercLabelMapperService implements LabelMapperHandler {

  constructor(
    protected httpClient: HttpClient,
    protected settingsSrvc: SettingsService<Settings>
  ) { }

  public canHandle(label: string): boolean {
    return label.startsWith('http://vocab.nerc.ac.uk');
  }

  public getMappedLabel(label: string): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      const url = this.findUrl(label);
      if (url) {
        const labelUrl =
          this.settingsSrvc.getSettings().proxyUrl ? this.settingsSrvc.getSettings().proxyUrl + url : url;
        this.httpClient.get(labelUrl, { responseType: 'text' }).subscribe((res) => {
          try {
            const xml = new DOMParser().parseFromString(res, 'text/xml');
            const temp = xml.getElementsByTagNameNS('http://www.w3.org/2004/02/skos/core#', 'prefLabel')[0];
            label = temp.textContent ? temp.textContent : label;
            this.confirmLabel(observer, label);
          } catch (error) {
            // found no matching element, so currently do nothing and use old label
            this.confirmLabel(observer, url);
          }
        }, (error) => {
          this.confirmLabel(observer, url);
        });
      } else {
        this.confirmLabel(observer, label);
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
