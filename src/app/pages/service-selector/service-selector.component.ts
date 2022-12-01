import { Component } from '@angular/core';
import { DatasetApi, HelgolandCoreModule, HelgolandParameterFilter, Settings, SettingsService } from '@helgoland/core';
import { HelgolandSelectorModule } from '@helgoland/selector';

@Component({
    templateUrl: './service-selector.component.html',
    styleUrls: ['./service-selector.component.css'],
    imports: [
        HelgolandCoreModule,
        HelgolandSelectorModule
    ],
    standalone: true
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
