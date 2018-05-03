# How to Integrate a D3 timeseries component

In this tutorial a stepwise instruction will be given on how to integrate a D3 timeseries component into an angular app (ng-app).

Starting from the very beginning in setting up the ng-app, angular-cli needs to be installed with npm. If you already have a running project skip Step 1 and start from [here](#step-2)

## Step 1: create ng-app

Following the instructions of the [angular quickstart guide](https://angular.io/guide/quickstart) a new ng-app will be created with its folder-structure.

Open a terminal and change the working directory to the supposed location, where you want to create your ng-app with an integrated D3 timeseries component. In this tutorial the new ng-app will be named `helgoland-D3`.

||Command|
| ------------- |-------------|
Install angular-cli     |   `npm install -g @angular/cli`
Create ng-app           |   `ng new helgoland-D3`
Change into app-folder  |   `cd helgoland-D3`
Start app               |   `ng serve --open`

#### Suggestions for error handling

- `Cannot find module '@angular-devkit/core'` click [here](https://github.com/angular/angular-cli/issues/9307)

## Step 2: import helgoland dependencies

To start working with the helgoland D3 component specific dependencies are needed: [helgoland-core](https://www.npmjs.com/package/@helgoland/core) and [helgoland-d3](https://www.npmjs.com/package/@helgoland/d3). For these dependencies [leaflet](https://www.npmjs.com/package/leaflet) is required, so this needs to be installed as well.

|Install dependencies|
|--------------------|
|`npm i @helgoland/core`|
|`npm i @helgoland/d3`|
|`npm i leaflet`|

Import dependencies to your ng-app by adding the following javascript code to `app.module.ts`:

```javascript
import{ HelgolandCoreModule } from '@helgoland/core';
import{ HelgolandD3Module } from '@helgoland/d3';
```

### Suggestions for error handling

- `Cannot find namespace 'GeoJSON'` see below

We have to adapt the `tsconfig.app.js`. Add to the types-array the type `geojson` which then should look like this:

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

## Step 3: add code

Now we will integrate the directive of the D3 component.
Implement the directive of the graph by adding the following code to `app.component.html`:

- Optional the stype can be adapted by adding stype options to the directive, for example adapt the size:  
`<div style="height: 500px; width: 500px;">`

```html
<div>
  <n52-d3-timeseries-graph [datasetIds]="datasetIdsMultiple" [selectedDatasetIds]="selectedIds" [datasetOptions]="datasetOptionsMultiple" [timeInterval]="timespan" 
  (onTimespanChanged)="timespanChanged($event)" (onHighlight)="highlight($event)" (onHighlightUom)="highlightUom($event)" 
  [graphOptions]="diagramOptionsD3"></n52-d3-timeseries-graph>
</div>
```
This code is implemented in the helgoland-toolbox github repository and can be viewew [here](https://github.com/52North/helgoland-toolbox/blob/master/src/demo/app/pages/timeseries-graph/timeseries-graph.component.html).

Implement the functionality of the graph-directive by adding the following code to `app.component.ts`:

```javascript
  public datasetIdsMultiple = ['http://www.fluggs.de/sos2/api/v1/__63', 'http://www.fluggs.de/sos2/api/v1/__72'];
  public colors = ['#123456', '#FF0000'];

  public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
  public diagramOptionsD3: D3PlotOptions = {
      togglePanZoom: false,
      showReferenceValues: false,
      generalizeAllways: true
  };

  public selectedIds: string[] = [];

  public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();
  public panZoom: any = 'zoom';

  constructor() {
      this.datasetIdsMultiple.forEach((entry, i) => {
          this.datasetOptionsMultiple.set(entry, new DatasetOptions(entry, this.colors[i]));
      });
  }

  public timespanChanged(timespan: Timespan) {
      this.timespan = timespan;
  }

  public togglePanZoom() {
      this.diagramOptionsD3.togglePanZoom = !this.diagramOptionsD3.togglePanZoom;
      this.panZoom = this.diagramOptionsD3.togglePanZoom === true ? 'pan' : 'zoom';
  }

  public highlight(ids: string[]) {
      this.selectedIds = ids;
  }
```
This code is implemented in the helgoland-toolbox github repository and can be viewew [here](https://github.com/52North/helgoland-toolbox/blob/master/src/demo/app/pages/timeseries-graph/timeseries-graph.component.ts).

## Step 4: add pan-zoom button

TODO