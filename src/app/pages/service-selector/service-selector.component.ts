import { Component } from '@angular/core';
import { DatasetApi, ParameterFilter, PlatformTypes, Settings, SettingsService, ValueTypes } from '@helgoland/core';

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

    public providerFilter: ParameterFilter = {
        platformTypes: PlatformTypes.stationary,
        valueTypes: ValueTypes.quantity
    };
}
