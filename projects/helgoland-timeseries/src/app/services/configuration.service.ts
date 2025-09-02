import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

export interface AppConfig extends Settings {
  supportTimeseriesSymbols: boolean;
  daysForOldTimespanCheck: number;
  dataTableVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService<
  T extends AppConfig = AppConfig,
> extends SettingsService<T> {
  private _configuration!: T;

  public get configuration(): T {
    return this._configuration;
  }

  public set configuration(config: T) {
    this._configuration = config;
    this.setSettings(config);
  }
}
