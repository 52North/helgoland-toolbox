import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { lastValueFrom, tap } from 'rxjs';

export interface AppConfig extends Settings {}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService extends SettingsService<Settings> {
  private readonly CONFIGURATION_URL = './assets/app-config.json';

  configuration!: AppConfig;

  constructor(private http: HttpClient) {
    super();
  }

  loadConfiguration(): Promise<AppConfig> {
    return lastValueFrom(
      this.http.get<AppConfig>(this.CONFIGURATION_URL).pipe(
        tap((configuration) => {
          this.configuration = configuration;
          return configuration;
        }),
      ),
    );
  }
}
