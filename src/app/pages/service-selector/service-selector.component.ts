import { Component } from '@angular/core';
import { DatasetApi, DatasetType, HelgolandParameterFilter, Settings, SettingsService } from '@helgoland/core';

@Component({
    templateUrl: './service-selector.component.html',
    styleUrls: ['./service-selector.component.css']
})
export class ServiceSelectorComponent {

    public datasetApis: DatasetApi[];

    constructor(
        private settings: SettingsService<Settings>
    ) {
        this.datasetApis = this.settings.getSettings().datasetApis;
    }

    public providerFilter: HelgolandParameterFilter = {
        // type: DatasetType.Trajectory
    };
}
