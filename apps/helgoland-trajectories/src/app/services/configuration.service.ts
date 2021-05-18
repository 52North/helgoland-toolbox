import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '@helgoland/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppConfig extends Settings {

}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private readonly CONFIGURATION_URL = './assets/app-config.json';

  configuration!: AppConfig;

  constructor(private http: HttpClient) { }

  loadConfiguration(): Promise<AppConfig> {
    return this.http
      .get<AppConfig>(this.CONFIGURATION_URL)
      .toPromise()
      .then((configuration: AppConfig) => {
        this.configuration = configuration;
        return configuration;
      });
  }

}
