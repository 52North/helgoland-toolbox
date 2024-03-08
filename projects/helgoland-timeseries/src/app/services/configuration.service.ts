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
export class ConfigurationService<T extends AppConfig = AppConfig> extends SettingsService<T> {

  private readonly CONFIGURATION_URL = './assets/app-config.json';

  configuration!: T;

  constructor(private http: HttpClient) {
    super();
  }

  loadConfiguration(): Promise<T> {
    return this.http
      .get<T>(this.CONFIGURATION_URL)
      .toPromise()
      .then((configuration: T) => {
        this.setSettings(configuration);
        this.configuration = configuration;
        return configuration;
      });
  }

}