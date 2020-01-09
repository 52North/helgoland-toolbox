import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
    constructor() {
        super();
        this.setSettings({});
    }
}

export const SettingsServiceTestingProvider = {
    provide: SettingsService,
    useClass: ExtendedSettingsService
};
