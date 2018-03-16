import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Settings } from '@helgoland/core';

import { AppModule } from './app';

export let settings: Settings;
export const settingsPromise = new Promise<Settings>((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './assets/settings.json');
  xhr.onload = () => {
    if (xhr.status === 200) {
      settings = JSON.parse(xhr.responseText);
      resolve(settings);
    } else {
      reject('Cannot load configuration');
    }
  };
  xhr.send();
});

Promise.all([settingsPromise]).then((config: any) => {
  platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.log(err));
});
