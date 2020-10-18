import { AppConfig } from './../model/app-config';

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