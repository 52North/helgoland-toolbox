import { AppConfig } from './../model/app-config';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

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