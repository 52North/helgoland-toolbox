import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { appConfigPromise } from './app/app-config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

Promise.all([appConfigPromise]).then(() => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
})
