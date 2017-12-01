import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Settings } from '../../src/model/settings/settings';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

export const settingsPromise = new Promise<Settings>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/settings.json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            const settings = JSON.parse(xhr.responseText);
            resolve(settings);
        } else {
            reject('Cannot load configuration...');
        }
    };
    xhr.send();
});
