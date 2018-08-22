import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

/**
 * This service maintaines all service urls which are secured with basic auth. The service is used to check for every servie url if it is necessary to work with basic auth. It is possible to
 * register a url and it also checks every dataset url in the settings.
 */
@Injectable()
export class BasicAuthServiceMaintainer {

  private services: string[] = [];

  constructor(
    protected settingsService: SettingsService<Settings>
  ) { }

  /**
   * Register an additional service url, which is secured with basic auth.
   */
  public registerService(url: string) {
    if (this.services.indexOf(url) === -1) {
      this.services.push(url);
    }
  }

  /**
   * Checks if a given url is registered as secured with basic auth.
   */
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
