# How to integrate a table component

In this tutorial a stepwise instruction will be given on how to integrate a table component into an angular app (ng-app).

A quite similar code is integrated in the helgoland-toolbox github repository and can be viewed [here](https://github.com/52North/helgoland-toolbox/tree/master/src/demo/app/pages/table).

First initialize an app as described in the prepare section [here](../how-tos.html) or integrate this component in an existing project.

## Step 1: import helgoland dependencies

To start working with the table component a few dependencies are needed: [helgoland-depiction](https://www.npmjs.com/package/@helgoland/depiction) and [helgoland-core](https://www.npmjs.com/package/@helgoland/core) are necessary to provide the table component. For translations [ngx-translate](http://www.ngx-translate.com/) is used and the [ngx-translate-http-loader](https://www.npmjs.com/package/@ngx-translate/http-loader) will load the translations.

|Install dependencies|
|--------------------|
|`npm i @helgoland/core`|
|`npm i @helgoland/depiction`|
|`npm i @ngx-translate/http-loader`|

Import dependencies to your ng-app by adding the following javascript code to `src/app/app.module.ts`:

```javascript
// Add dependencies for helgoland components.
import { HelgolandDatasetTableModule } from '@helgoland/depiction/dataset-table';
import { DatasetApiInterface, SplittedDataDatasetApiInterface } from '@helgoland/core';

// Add dependencies for translations.
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
```

Another step is to add the dependencies correctly to the `@NgModule`. As imports we will define the `TranslateModule` and the `HelgolandDatasetTableModule` and as providers we need to take the `DatasetApiInterface` with the `SplittedDataDatasetApiInterface` as `useClass`. To use the translation functions we will add a function called `HttpLoaderFactory` which is to be exported.
You can compare your `src/app/app.module.ts` file with the following code below:

```javascript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HelgolandDatasetTableModule
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
```

### Suggestions for error handling

- `Cannot find namespace 'GeoJSON'` see below

By manually adapting the configuration in `src/tsconfig.app.js` this issue should be solved. But to let the changes be accepted, the app has to be restarted (by executing `ng serve`). Add to the types-array the type `geojson` which then should look like this:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/app",
    "baseUrl": "./",
    "module": "es2015",
    "types": ["geojson"]
  },
  "exclude": [
    "test.ts",
    "**/*.spec.ts"
  ]
}
```

## Step 2: add code

Now we will integrate the directive of the table component. Implement the directive of the table by replacing all of `src/app/app.component.html` with the following code. All fields in the `n52-dataset-table`-directive are required to provide options, datasets and other information.

```html
<n52-dataset-table [datasetIds]="datasetIds" [timeInterval]="timespan" [datasetOptions]="datasetOptions"></n52-dataset-table>
```

Implement the parameter for the `n52-dataset-table`-directive by adding the following code to the class `AppComponent` in `src/app/app.component.ts`:

```javascript
// defines the dataset by internal id structure
public datasetIds = [
  'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__95',
  'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__96',
  'http://geo.irceline.be/sos/api/v1/__6941',
  'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__97'
];

// defines the timeframe for which data should be fetched
public timespan = new Timespan(
  new Date('2017-10-24T01:49:59.000Z').getTime(),
  new Date('2017-10-25T01:49:59.000Z').getTime()
);

// defines the datasetOptions, where the color can be set
public datasetOptions: Map<string, DatasetOptions> = new Map();

constructor() {
  let i = 0;
  // sets the color to the datasetOptions
  const colors = ['firebrick', 'yellow', 'darkgreen', 'lightblue'];
  this.datasetIds.forEach((entry) => {
    this.datasetOptions.set(entry, new DatasetOptions(entry, colors[i++]));
  });
}
```
This code is implemented in the helgoland-toolbox github repository and can be viewed [here](https://github.com/52North/helgoland-toolbox/blob/master/src/demo/app/pages/timeseries-graph/timeseries-graph.component.ts).

**A very important step should not be missed**  
To use the functionality of the functions in the `src/app/app.component.ts` we need to add the dependencies to use for example `DatasetOptions` and `Timespan`. This is done by using the following imports:

```javascript
import { DatasetOptions, Timespan } from '@helgoland/core';
```

### Suggestions for error handling

- `error TS2307: Cannot find module '@helgoland/depiction/dataset-table'.` Please upgrade the `typescript` dependency to a least `2.6.0` by `npm i typescript@~2.6`

## Step 3: start working

Now, that we have added all dependencies and the code to access the functionality of the table component you can start working on your app. If you did not run the app while following this tutorial you should now see the dataset table by starting your app with `ng serve`.