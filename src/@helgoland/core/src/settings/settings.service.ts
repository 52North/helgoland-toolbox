import { Settings } from '../model/settings/settings';

export abstract class SettingsService<T extends Settings> {

    private settings: T;

    constructor() {
        // Default empty settings
        this.settings = {} as T;
    }

    public getSettings() {
        return this.settings;
    }

    protected setSettings(settings: T) {
        this.settings = settings;
    }

}
