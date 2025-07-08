import { Component, inject } from '@angular/core';
import {
  DatasetApi,
  HelgolandCoreModule,
  HelgolandParameterFilter,
  Settings,
  SettingsService,
} from '@helgoland/core';
import { HelgolandSelectorModule } from '@helgoland/selector';

@Component({
  templateUrl: './service-selector.component.html',
  styleUrls: ['./service-selector.component.css'],
  imports: [HelgolandCoreModule, HelgolandSelectorModule],
})
export class ServiceSelectorComponent {
  private settings = inject<SettingsService<Settings>>(SettingsService);

  public datasetApis: DatasetApi[] | undefined;

  constructor() {
    this.datasetApis = this.settings.getSettings().datasetApis;
  }

  public providerFilter: HelgolandParameterFilter = {
    // type: DatasetType.Trajectory
  };
}
