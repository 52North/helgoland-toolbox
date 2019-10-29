import { Injectable } from '@angular/core';
import { SettingsService } from '../helgoland/core/src/lib/settings/settings.service';
import { Settings } from '../helgoland/core/src/lib/model/settings/settings';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
    constructor() {
        super();
        this.setSettings({
        });
    }
}

export const SettingsServiceTestingProvider = {
    provide: SettingsService,
    useClass: ExtendedSettingsService
};
