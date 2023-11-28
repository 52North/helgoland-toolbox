import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Settings, SettingsService } from "@helgoland/core";
import { lastValueFrom, tap } from "rxjs";

export interface AppConfig extends Settings {
  supportTimeseriesSymbols: boolean;
}

@Injectable({
  providedIn: "root"
})
export class ConfigurationService<T extends AppConfig = AppConfig> extends SettingsService<T> {

  private readonly CONFIGURATION_URL = "./assets/app-config.json";

  configuration!: T;

  constructor(private http: HttpClient) {
    super();
  }

  loadConfiguration(): Promise<T> {
    const request = this.http
      .get<T>(this.CONFIGURATION_URL)
      .pipe(tap(configuration => {
        this.setSettings(configuration);
        this.configuration = configuration;
      }))
    return lastValueFrom(request);
  }

}