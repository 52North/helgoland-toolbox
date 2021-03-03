import { Settings } from '@helgoland/core';

// tslint:disable-next-line: no-empty-interface
export interface AppConfig extends Settings {

}

export let appConfig: AppConfig;

export const appConfigPromise = new Promise<AppConfig>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/app-config.json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            appConfig = JSON.parse(xhr.responseText);
            resolve(appConfig);
        } else {
            reject('Cannot load configuration');
        }
    };
    xhr.send();
});