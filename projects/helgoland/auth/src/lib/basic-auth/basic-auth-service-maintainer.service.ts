import { Injectable, inject } from '@angular/core';
import { DatasetApi, Settings, SettingsService } from '@helgoland/core';

interface BasicAuthDatasetApi extends DatasetApi {
  basicAuthPostFix?: string;
}

/**
 * This service maintaines all service urls which are secured with basic auth. The service is used to check for every servie url if it is necessary to work with basic auth. It is possible to
 * register a url and it also checks every dataset url in the settings.
 */
@Injectable()
export class BasicAuthServiceMaintainer {
  protected settingsService =
    inject<SettingsService<Settings>>(SettingsService);

  private services: string[] = [];

  /**
   * Register an additional service url, which is secured with basic auth.
   */
  registerService(url: string) {
    if (this.services.indexOf(url) === -1) {
      this.services.push(url);
    }
  }

  /**
   * Checks if a given url is registered as secured with basic auth.
   */
  getCorrespondingService(url: string): string | undefined {
    const matchedUrl = this.services.find((e) => url.startsWith(e));
    if (matchedUrl) {
      return matchedUrl;
    }
    const settings = this.settingsService.getSettings();
    if (
      settings &&
      settings.datasetApis &&
      Array.isArray(settings.datasetApis)
    ) {
      const api = (settings.datasetApis as BasicAuthDatasetApi[]).find(
        (e) => url.startsWith(e.url) && e.basicAuth,
      );
      if (api) {
        return `${api.url}${api.basicAuthPostFix ? api.basicAuthPostFix : ''}`;
      }
    }
    return undefined;
  }
}
