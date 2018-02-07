/**
 * Angular bootstrapping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Settings } from '@helgoland/core';
import { environment } from 'environments/environment';

import { AppModule } from './app';

/**
 * App Module
 * our top level module that holds all of our components
 */
/**
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(environment.decorateModuleRef)
    .catch((err) => console.error(err));
}

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
  case 'loading':
    document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
    break;
  case 'interactive':
  case 'complete':
  default:
    main();
}

function _domReadyHandler() {
  document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
  main();
}

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
