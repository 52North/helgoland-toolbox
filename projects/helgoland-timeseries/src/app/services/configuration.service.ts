import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppConfig extends Settings {
  supportTimeseriesSymbols: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends SettingsService<Settings> {

  private readonly CONFIGURATION_URL = './assets/app-config.json';

  configuration!: AppConfig;

  constructor(private http: HttpClient) {
    super();
  }

  loadConfiguration(): Promise<AppConfig> {
    return this.http
      .get<AppConfig>(this.CONFIGURATION_URL)
      .toPromise()
      .then((configuration: AppConfig) => {
        this.setSettings(configuration);
        this.configuration = configuration;
        return configuration;
      });
  }

}