import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

@Injectable()
export class BasicAuthServicesKeeper {

  private services: string[] = [];

  constructor(
    protected settingsService: SettingsService<Settings>
  ) { }

  public registerService(url: string) {
    if (this.services.indexOf(url) === -1) {
      this.services.push(url);
    }
  }

  public getCorrespondingService(url: string): string {
    const matchedUrl = this.services.find(e => url.startsWith(e));
    if (matchedUrl) {
      return matchedUrl;
    }

    const api = this.settingsService.getSettings().datasetApis.find((e) => url.startsWith(e.url) && e.basicAuth);
    if (api) {
      return api.url;
    }
  }

}
