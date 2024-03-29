# How to Wrap D3 Component as Angular-Element (for static html)

In this tutorial a stepwise instruction will be given on how to use a wrapper as [angular-element](https://angular.io/guide/elements) for the d3 component to become independent of angular and to use d3 for example in a standalone (static) html file.
An example implementation can be found [here](https://github.com/52North/d3wrapper).

First initialize an app as described in the prepare section [here](../how-tos.html).

(The first steps will work similar to the integration of D3 timeseries component, but differ in important changes.)

## Step 1: import helgoland dependencies

To start working with the helgoland D3 component a few dependencies are needed: [helgoland-d3](https://www.npmjs.com/package/@helgoland/d3) and [helgoland-core](https://www.npmjs.com/package/@helgoland/core) are necessary to provide the D3 timeseries component, in detail, to visualize the diagram containing the dataset graphs and to get accesss via the dataset API. For translations [ngx-translate](http://www.ngx-translate.com/) is used and the [ngx-translate-http-loader](https://www.npmjs.com/package/@ngx-translate/http-loader) will load the translations.

|Install dependencies|
|--------------------|
|`npm i @helgoland/core`|
|`npm i @helgoland/d3`|
|`npm i @ngx-translate/http-loader`|

Import dependencies to your ng-app by adding the following javascript code to `src/app/app.module.ts`:

```js
// Add dependencies for helgoland components.
import { HelgolandD3Module } from '@helgoland/d3';
import { DatasetApiInterface, SplittedDataDatasetApiInterface } from '@helgoland/core';

// Add dependencies for translations.
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
```

Another step is to add the dependencies correctly to the `@NgModule`. As imports we will define the `TranslateModule` and the `HelgolandD3Module` and as providers we need to take the `DatasetApiInterface` with the `SplittedDataDatasetApiInterface` as `useClass`. To use the translation functions we will add a function called `HttpLoaderFactory` which is to be exported.
You can compare your `src/app/app.module.ts` file with the following code below:

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component'; // ***

@NgModule({
  declarations: [
    AppComponent // ***
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
    HelgolandD3Module
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    }
  ],
  bootstrap: [AppComponent] // ***
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
```

## Step 3: import further dependencies

Since the latest relaese, we further need to import connectors to the API as providers. Therefore, we add `DatasetApiV1ConnectorProvider, DatasetApiV2ConnectorProvider, DatasetApiV3ConnectorProvider` to the providers, imported from `@helgoland/core`.

## Step 4: generate new component

As we want to implement a standalone element, we need to generate a new component which will be later used for the D3 component integration. This component will get a directive tag name that can be used in a static html file.
First generate a new component inside our application. This can be done via the command line:

| Create new component named `D3TimeseriesGraphWrapperComponent` |
|--------------------|
|`ng g c D3TimeseriesGraphWrapper`|

Additional information on how to generate a new component can be found [here](https://angular.io/cli/generate#component-command).

When we have added the component, the imports will be automatically updated inside the `app.module.ts`.


## Step 5: add code

Now we will integrate the directive of the D3 timeseries component into the newly generated component (here called: `D3TimeseriesGraphWrapperComponent`). Implement the directive of the graph by adding the following code to `src/app/d3-timeseries-graph-wrapper/d3-timeseries-graph-wrapper.component.html`. All fields in the `n52-d3-timeseries-graph`-directive are required to provide options, datasets and other information.
Every other code that was generated by the app creation is not necessary to run the D3 timeseries component. This can be deleted or kept for further coding.

```html
<div>
  <n52-d3-timeseries-graph
  [datasetIds]="datasetIds"
  [datasetOptions]="datasetOptions"
  [timeInterval]="timespan"
  [selectedDatasetIds]="selectedIds"
  (onTimespanChanged)="timespanChanged($event)"></n52-d3-timeseries-graph>
</div>
```

- Optional the style can be adapted by adding a css style modification to the directive. For example the following code will change the size:  

```html
<div style="height: 500px; width: 100%;"></div>
```

This code is implemented in the helgoland-toolbox github repository and can be viewed [here](https://github.com/52North/helgoland-toolbox/blob/develop/src/app/pages/timeseries-graph/timeseries-graph.component.html).

Implement the functionality of the `n52-d3-timeseries-graph`-directive by adding the following code to the `D3TimeseriesGraphWrapperComponent` in `src/d3-timeseries-graph-wrapper/d3-timeseries-graph-wrapper.component.ts`:

- Attention: If you would like to have pre-selected colors for your graph, you can change and add the color as string in the array of the variable `colors`. If you do not provide any color-entries in the array or not enough color-entries with this array, all missing colors will be randomly generated in the D3 timeseries component, because each graph needs an own color-entry.

```js
// These variables define the links for accessing the datasets and in which colors they are styled.
public datasetIds = ['https://fluggs.wupperverband.de/sws5/api/__63', 'https://fluggs.wupperverband.de/sws5/api/__72'];
public colors = ['#123456', '#FF0000'];

// The timespan will be set to the last 28 hours which is calculated in milliseconds (milliseconds*1000 = 100000000).
public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());

// These are the plotting options. The boolen of 'togglePanZoom' is set to 'true' to pan the graph.
public diagramOptionsD3: D3PlotOptions = {
    togglePanZoom: true,
    showReferenceValues: false,
    generalizeAllways: true
};

// 'selectedIds' determines the graphs that are visualized with a larger stroke-width. This can be set by clicking on the y-axis.
public selectedIds: string[] = [];
public datasetOptions: Map<string, DatasetOptions> = new Map();

constructor() {
    this.datasetIds.forEach((entry, i) => {
        this.datasetOptions.set(entry, new DatasetOptions(entry, this.colors[i]));
    });
}

// This function changes the timespan of the graph which is needed for panning (and zooming).
public timespanChanged(timespan: Timespan) {
    this.timespan = timespan;
}
```
This code is implemented in the helgoland-toolbox github repository and can be viewed [here](https://github.com/52North/helgoland-toolbox/blob/develop/src/app/pages/timeseries-graph/timeseries-graph.component.ts).

**A very important step should not be missed**  
To use the functionality of the functions in the `D3TimeseriesGraphWrapperComponent` we need to add the dependencies to use for example `Timespan` and `D3PlotOptions`. This is done by using the following imports:

```js
import { DatasetOptions, Timespan } from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
```

## Step 6: first check-up

For a first check-up we need to integrate our new component via selector into the `AppComponent`. We use the selector of the `D3TimeseriesGraphWrapperComponent` and add it as a directive to the `src/app/app.component.html`. We do not need any further inputs or outputs right now. Run the application with `ng serve` and you will see a diagram using the D3 component.

### Suggestions for Errorhandling

#### error: moment

When starting the current version for the first time, you may come across the following error:

```sh
ERROR in node_modules/@helgoland/core/lib/time/time.service.d.ts(1,8): error TS1192: Module '"/.../helgoland-how-to/node_modules/moment/moment"' has no default export.
```

Do solve this error we need to enable `allowSyntheticDefaultImports` in the `tsconfig.json`. Therefore add `"allowSyntheticDefaultImports": true,` in the `compilerOptions`.

#### error: global

When the application has started, the console may show the error `Uncaught ReferenceError: global is not defined`. To solve this error add the following code to the `<head>` tag in the `index.html`:

```html
<!-- https://github.com/aws/aws-amplify/issues/678 fix: -->
<script>
    if (global === undefined) {
        var global = window;
    }
</script>
<!-- https://github.com/aws/aws-amplify/issues/678 fix end-->
```


## Step 7: standalone element

We have integrated the D3 component successfully. It is time to create an angular element from this application now.

As we will not use them anymore, the files `app.component.html, app.component.scss, app.component.spec.ts, app.component.ts` can be removed from the application. You may also just cut them out of the folder and paste outside of the application, because for the implementation of the `D3TimeseriesGraphWrapper` it is easier to run the application with `ng serve` while still developing than building and packing for the static html each time - You will see later why. So let's cut these files and paste them into a folder outside of the application.
That the application does not look for the `AppComponent` we need to do some changes to the `app.module.ts`. You might have recognized some lines of code which have the comment `// ***`. These lines can be commented completely. Also we need to add `D3TimeseriesGraphWrapperComponent` to the `entryComponents`. You will see the adaptations here:

```js
// import { AppComponent } from './app.component'; // ***

[...]

declarations: [
    // AppComponent, // ***
    D3TimeseriesGraphWrapperComponent
  ],

[...]

  // bootstrap: [AppComponent] // ***
  entryComponents: [
    D3TimeseriesGraphWrapperComponent
  ]
```

We will just comment them, so if we want to develop the application (much faster) using the `AppComponent`, we can just uncomment these lines, add the previously cutted files of the `AppComponent` and run the application with `ng serve`.

Next step is to make a custom angular element from our `D3TimeseriesGraphWrapperComponent`. Therefore we add the following code to the `AppModule`. This will create a custom element with the directive tag `d3-timeseries-graph-wrapper`. With this tag our static html file will be able to access the `D3TimeseriesGraphWrapper` and the application's dependencies in the end.

```js
export class AppModule {
  constructor(injector: Injector) {
    const custom = createCustomElement(D3TimeseriesGraphWrapperComponent, { injector });
    customElements.define('d3-timeseries-graph-wrapper', custom);
  }

  ngDoBootstrap() {}
}
```

To use these function we need to install `@angular/elements` and import `createCustomElement` into `app.module.ts`, as well as `Injector` from `@angular/core`.

|Install dependencies|
|--------------------|
|`npm i @angular/elements`|

## Step 8: integration into static html

Inside the application folder, on the same level as the `src` folder, we will add a new folder called `preview`. Inside this folder, we create an `index.html` file. This will be our static html file as example. To the body part inside the `index.html` we add the directive tag of the custom component which we have choosen (`d3-timeseries-graph-wrapper`) and we import right below the concatenated .js-file of our application `<script src="./d3TsWrapper.js"></script>`. This script will provide the static html file with our D3TimeseriesGraphWrapperComponent and the angular and helgoland dependencies. The creation of that file will be explained in the next step.

The index.html inside the preview folder may look like this:

```html
<html>

<body>
    <d3-timeseries-graph-wrapper></d3-timeseries-graph-wrapper>

    <script src="./d3TsWrapper.js"></script>
</body>

</html>

```

### Suggestions for Errorhandling

You might come across this error again, which will say, `Uncaught ReferenceError: global is not defined`. To solve this error add the following code right below the `<html>` tag:

```html
<!-- https://github.com/aws/aws-amplify/issues/678 fix: -->
<script>
    if (global === undefined) {
        var global = window;
    }
</script>
<!-- https://github.com/aws/aws-amplify/issues/678 fix end-->
```

## Step 9: build, pack, start

To create the wrapper and run the static html we will use the following commands:

|build, pack, start| |
|--------------------|---|
|`ng build --prod --output-hashing=none`| build application in production mode |
|`cat dist/helgoland-how-to/runtime-es2015.js dist/helgoland-how-to/polyfills-es2015.js dist/helgoland-how-to/main-es2015.js > preview/d3TsWrapper.js`| concatenate all necessary built files to one file called `d3TsWrapper.js` |
|`npx live-server preview`| run static html as server |

Watch out: If you have a different application name than `helgoland-how-to`, you have to change the command above for the concatenation.

You can access the page in the browser on `localhost:8080`, which will be automatically opened. If you want to prevent automatic opening in browser you can add `--no-browser` to the command to run the static html file or adapt the port with `--port=NUMBER`.

## Step 10: start working

Now, that we have runnning a static html file using angular, helgoland and the D3 component in a wrapper, we can keep adding further code and functionality. There are much more options just like inputs and outpus to integrate in such a wrapper, whose integration will be explained in further steps.

Hint: If you want to develop on the wrapper, you can now add the `AppComponent` again and uncomment the marked lines in the `app.module.ts`. You will see that it is much easier to adapt the application while running as angular application and not as angular element.

## Step 11: additional options

### D3 Component

#### Add initial min, max value for y axis

It is possible to emit a min and max value for the y-axis with the DatasetOptions for each dataset. With these values, the y-axis will only show the selected y-range. Some restrictions are:

  - If there is no data provided in the selected timerange and y-axis min/max values, the default min and max range will be used.
  - If the y-axis min and max values are equal, the default min and max range will be used.
  
#### Zero-based y axis

It is possible to set a boolean in the DatasetOptions (`zeroBasedYAxis`) to show the y axis with minimum as 0, if the data in the selected timerange is above 0, or maximum 0, if the data in the selected timerange is below 0.

#### HelgolandModificationModule

To add and manipulate pan- and zoom-handler you can add the `HelgolandModificationModule` via `npm i @helgoland/modification`. With this module you can for example add a button to switch between panning and zooming.

Add this code to the `d3-timeseries-graph-wrapper.component.html`:

```html
<n52-drag-options (onTogglePanZoom)="togglePanZoom()"></n52-drag-options>
```

Add this code to the `D3TimeseriesGraphWrapperComponent`:

```js
public togglePanZoom() {
    this.diagramOptionsD3.togglePanZoom = !this.diagramOptionsD3.togglePanZoom;
    this.panZoom = this.diagramOptionsD3.togglePanZoom === true ? 'pan' : 'zoom';
}
```

### Wrapper Element

To see further adaptions like Inputs or Outputs with Eventlisteners look [here](https://github.com/52North/d3wrapper). You will find an example implementation.