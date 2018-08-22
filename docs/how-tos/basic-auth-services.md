# How to using basic auth services

## Enable basic auth support

Just import `BasicAuthModule` of the module `@helgoland/auth` in your application. This will provide an angular service to register additional service urls for the basic auth. It also registers a http interceptor to decide if a basic auth token is needed for the request.

## Inform the application that a service url is secured with basic auth

### by settings for all configured dataset-apis

Extend the configuration in your settings `datasetApis` with a `basicAuth` flag, for example in this way:

```json
"datasetApis": [
  {
    "name": "BasicAuthSecuredAPI",
    "url": "https://url-to/api/v1/",
    "basicAuth": true
  }
]
```

### by registering the url by 'hand'

Use an injected service `BasicAuthServiceMaintainer` and register the url in this way:

```typescript
this.basicAuthServiceMaintainer.registerService('https://url-to/api/v1/');
```

## How to get credentials for a basic auth

Implement the `BasicAuthInformer` with the method `doBasicAuth`. Here you can provide the User a login mask (maybe a modal window), do the auth process. And fulfill the Observable in any case, if authencation was successful or not. See a simple example here:

```typescript
import { Injectable } from '@angular/core';
import { BasicAuthService } from '@helgoland/auth';
import { Observable, Observer } from 'rxjs';
import { BasicAuthInformer } from '@helgoland/auth';

@Injectable()
export class BasicAuthInformerImplService implements BasicAuthInformer {

  constructor(
    private basicAuthSrvc: BasicAuthService
  ) { }

  public doBasicAuth(url: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const username = prompt('Basic Auth username for ' + url);
      const password = prompt('Basic Auth password for ' + url);
      this.basicAuthSrvc.auth(username, password, url).subscribe(
        token => {
          observer.next(true);
          observer.complete();
        },
        error => {
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
}
```
