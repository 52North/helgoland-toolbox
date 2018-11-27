# How to Integrate a helgoland map

In this tutorial a stepwise instruction will be given on how to integrate a helgoland map into an angular app (ng-app).

First initialize an app as described in the prepare section [here](https://github.com/52North/helgoland-toolbox/blob/develop/docs/how-tos.md) or integrate the helgoland map in an existing project. In the following we will refer to the class AppComponent as main class, where we will add the helgoland map. In case of intergating the helgoland map into an existing project, it should be taken care of to add the code in the correct html, ts and module files.
**During the integration of the helgoland map, errors might occur. Please read the steps till the end to use the provided solutions for potential errors.**

## Step 1: import helgoland dependencies

To start working with the helgoland map a few dependencies are needed:
- [helgoland-map](https://www.npmjs.com/package/@helgoland/map) and [helgoland-core](https://www.npmjs.com/package/@helgoland/core) are necessary to provide the app with access to various helgoland map specifications.
- For translations [ngx-translate](http://www.ngx-translate.com/) is used and the [ngx-translate-http-loader](https://www.npmjs.com/package/@ngx-translate/http-loader) will load the translations.
- [helgoland-selector](https://www.npmjs.com/package/@helgoland/selector) and [helgoland-depiction](https://www.npmjs.com/package/@helgoland/depiction) are used for further interaction with the map.

|Install dependencies|
|---|
|`npm i @helgoland/core`|
|`npm i @helgoland/map`|
|`npm i @ngx-translate/http-loader`|
||
|`npm i @helgoland/selector`|
|`npm i @helgoland/depiction`|

Import dependencies to your ng-app by adding the following javascript code to `src/app/app.module.ts`:

```javascript
// Add dependencies for helgoland components.
import { HelgolandMapSelectorModule } from '@helgoland/map';
import { DatasetApiInterface, SplittedDataDatasetApiInterface } from '@helgoland/core';

// Add dependencies for translations.
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
```

Another step is to add the dependencies correctly to the `@NgModule`. As imports we will define the `TranslateModule` and as providers we need to take the `DatasetApiInterface` with the `SplittedDataDatasetApiInterface` as `useClass`. To use the translation functions we will add a function called `HttpLoaderFactory` which needs to be exported.
Further, to add a helgoland map, we need to add `HelgolandMapSelectorModule` to the imports.
You can compare your `src/app/app.module.ts` file with the following code below:

```javascript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HelgolandMapSelectorModule
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

To fully add leaflet to the app, we need to make sure, that the tiles of the leaflet map are loaded. Therefore we will need to embed the leaflet styles into the main `styles.scss`:

```css
@import '~leaflet/dist/leaflet.css';
```

### Suggestions for error handling

#### redeclare block-scoped variable 'ngDevMode'
```
ERROR in node_modules/@angular/core/src/render3/ng_dev_mode.d.ts(9,11): error TS2451: Cannot redeclare block-scoped variable 'ngDevMode'.
```
**Solution:** add to your main `tsconfig.json` the following code after `lib` (click [here](https://github.com/angular/angular/issues/21670) for more information regarding this issue)
```json
,
"paths": {
    "@angular/*":["node_modules/@angular/*"],
}
```
#### rxjs
```
ERROR in node_modules/@helgoland/map/lib/base/geosearch/geosearch.d.ts(3,10): error TS2305: Module '"./helgoland-how-to/node_modules/rxjs/Observable"' has no exported member 'Observable'.
node_modules/@helgoland/map/lib/base/geosearch/nominatim.service.d.ts(4,10): error TS2305: Module '"./helgoland-how-to/node_modules/rxjs/Observable"' has no exported member 'Observable'.
node_modules/rxjs/Observable.d.ts(1,15): error TS2307: Cannot find module 'rxjs-compat/Observable'.
node_modules/rxjs/operator/map.d.ts(1,15): error TS2307: Cannot find module 'rxjs-compat/operator/map'.
```

**Solution:** install rxjs-compat with the following command: `npm install rxjs-compat --save`

## Step 2: add code

Now we will integrate the directive of the helgoland map. Implement the directive of the map by adding the following code to `src/app/app.component.html`. All fields in the `n52-station-map-selector`-directive are required to provide options and other information.

```html
<div>
  <n52-station-map-selector [mapId]="'timeseries'" [serviceUrl]="providerUrl" [filter]="stationFilter" [zoomControlOptions]="zoomControlOptions"
    [mapOptions]="mapOptions" [fitBounds]="fitBounds" [avoidZoomToSelection]="avoidZoomToSelection" [baseMaps]="baseMaps"
    [overlayMaps]="overlayMaps" [layerControlOptions]="layerControlOptions" (onSelected)="onStationSelected($event)"
    [cluster]="cluster" [statusIntervals]="statusIntervals" (onContentLoading)="loadingStations = $event"></n52-station-map-selector>
</div>
<div>Is loading: {{loadingStations}}</div>
```

- Optional the style can be adapted by adding a css style modification to the directive. For example the following code will change the size:  

```html
<div style="height: 500px;"></div>
```

This code is implemented in the helgoland-toolbox github repository and can be viewed [here](https://github.com/52North/helgoland-toolbox/blob/develop/src/app/pages/map-selector/map-selector.component.html).

Implement the functionality of the `n52-station-map-selector`-directive by adding the following code to the class `AppComponent` in `src/app/app.component.ts`:

```javascript
public providerUrl = 'http://geo.irceline.be/sos/api/v1/';

public fitBounds: L.LatLngBoundsExpression = [[49.5, 3.27], [51.5, 5.67]];
public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
public avoidZoomToSelection = false;
public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
public cluster = false;
public loadingStations: boolean;
public stationFilter: ParameterFilter = {
// phenomenon: '8'
};
public statusIntervals = false;
public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };

public onStationSelected(station: Station) {
    console.log('Clicked station: ' + station.properties.label);
}
```

This code is implemented in the helgoland-toolbox github repository and can be viewed [here](https://github.com/52North/helgoland-toolbox/blob/develop/src/app/pages/map-selector/map-selector.component.ts).

**A very important step should not be missed**  
To use the functionality of the functions in the class `AppComponent` we need to add the dependencies to use predefined data types or interface (e.g. `LayerOptions`). Predefined marker icons (the iconURL can be adapted by the path to your own marker image) can also be added, but this is optional to create a map, because otherwise default marker images will be used.

```javascript
import { ParameterFilter, Phenomenon, Station } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions } from '@helgoland/map';
import * as L from 'leaflet';

// optional, to adapt leaflet markers
L.Marker.prototype.options.icon = L.icon({
    iconRetinaUrl: 'assets/img/marker-icon-2x.png',
    iconUrl: 'assets/img/marker-icon.png',
    shadowUrl: 'assets/img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
```

## Step 3: add further interaction

We have managed to add a helgoland map to our app with markers on it and the possibility to receive click events giving information about which station was clicked. To extend the model by a `zoom to extent`-button or a list of phenomenons, the following instructions might be helpful.

### Helgoland Map Control

With this Module it is possible to zoom back to the start view position and as well search for streets, cities, countries, etc. .

Add `HelgolandMapControlModule` to the imports of `@helgoland/map` and also to the imports of `@NgModule` similar to the way described in earlier steps. Then we can add either the Geosearch Control or the Extent Control or both.
For the Geosearch Control we need to add a provider. Therefore add `GeoSearch` and `NominatimGeoSearchService` to the imports of `@helgoland/map` and the following code to the providers array of `@NgModule`:

#### Geosearch and Extended Control

To add these controls we need to use GeoSearch as a provider in our `src/app/app.module.ts`.

```javascript
{
    provide: GeoSearch,
    useClass: NominatimGeoSearchService
},
```

Directives to be added in the `src/app/app.component.html`.

```html
<n52-geosearch-control mapId="timeseries" [options]="searchOptions"></n52-geosearch-control>
<n52-extent-control mapId="timeseries" [extent]="fitBounds"></n52-extent-control>
```

The code to be added to the class `AppComponent`, that declares the missing input value for the geosearch-control-directive.

```javascript
public searchOptions: GeoSearchOptions = { countrycodes: [] };
```

### Helgoland Selector

If you did not install the dependencies `@helgoland/selector` and `@helgoland/depiction` yet, than you should install them now as seen in the first step.

#### Settings Service Provider

To add the Helgoland Selector Module to our app and use the service-filter for the helgoland map, we need to import and extend a service. Therefore we need to import Settings in our `./environements/environment.ts` and export the variable `settings` of type `Settings`.

```javascript
import { Settings } from '@helgoland/core';

export let settings: Settings = {};
```

Then we need to create a new folder called `settings` and a file `settings.service.ts` in that the service-extension  `ExtendedSettingsService` will be implemented using the following code:

```javascript
import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

import { settings } from '../../environments/environment';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
    constructor() {
        super();
        this.setSettings(settings);
    }
}
```

The `ExtendedSettingsService` needs to be added to the imports in the `src/app/app.module.ts`.

```javascript
import { ExtendedSettingsService } from './settings/settings.service';
```

The project tree should look similar to this now:

```
src
|___ app
    |___ settings
        |___settings.service.ts
    |___ app.component.html
    |___ app.component... ~files
    |___ app.module.ts
|___ assets
|___ environments
    |___ environment.ts
```

#### Service Filter Selector

Further, import the additionally installed dependencies to our ng-app by adding the following javascript code to `src/app/app.module.ts` and adding the imports as well to the imports of `@NgModule`. Also add the dependency `SettingsService` to the imports of `@helgoland/core`:

```javascript
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
```

We can use the new created `ExtendedSettingsService` as `useClass` for our `SettingsService` provider.

```javascript
{
    provide: SettingsService,
    useClass: ExtendedSettingsService
},
```

To add the directive of the filter selector, the following code needs to be added to the `src/app/app.component.html`.

```html
<n52-service-filter-selector [serviceUrl]="providerUrl" endpoint="phenomenon" (onItemSelected)="onSelectPhenomenon($event)"></n52-service-filter-selector>
```
Addtionally, to use the select events, the code below can be added to the class `AppComponent`.

```javascript
public onSelectPhenomenon(phenomenon: Phenomenon) {
    console.log('Select: ' + phenomenon.label + ' with ID: ' + phenomenon.id);
    this.stationFilter = {
        phenomenon: phenomenon.id
    };
}
```

## Step 4: start working

Now, that we have added all dependencies and the code to access the functionality of the helgoland map you can start working on your app. If you did not run the app while following this tutorial you should now see the map by starting your app with `ng serve` and some more interaction possibilities below the map.

## Step 5: check code

In the following the main app files can be viewed. If you would like to change the styling of your page, you might have a closer look at the `app.component.html`.

#### `src/app/app.component.html`
```html
<h1>How To: Integrate Helgoland Map</h1>

<div style="display: flex; flex-direction: row;">
  <div style="width: 500px; padding: 5px;">
    <div style="height: 500px;">
      <n52-station-map-selector [mapId]="'timeseries'" [serviceUrl]="providerUrl" [filter]="stationFilter"
        [zoomControlOptions]="zoomControlOptions" [mapOptions]="mapOptions" [fitBounds]="fitBounds"
        [avoidZoomToSelection]="avoidZoomToSelection" [baseMaps]="baseMaps" [overlayMaps]="overlayMaps"
        [layerControlOptions]="layerControlOptions" (onSelected)="onStationSelected($event)" [cluster]="cluster"
        [statusIntervals]="statusIntervals" (onContentLoading)="loadingStations = $event"></n52-station-map-selector>
    </div>
    <div>Is loading: {{loadingStations}}</div>
    <n52-geosearch-control mapId="timeseries" [options]="searchOptions"></n52-geosearch-control>
    <n52-extent-control mapId="timeseries" [extent]="fitBounds"></n52-extent-control>
  </div>
  <div style="width: 200px;">
    <n52-service-filter-selector [serviceUrl]="providerUrl" endpoint="phenomenon" (onItemSelected)="onSelectPhenomenon($event)"></n52-service-filter-selector>
  </div>
</div>

<router-outlet></router-outlet>
```

#### `src/app/app.component.ts`
```javascript
import { Component } from '@angular/core';

import { ParameterFilter, Phenomenon, Station } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions } from '@helgoland/map';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public providerUrl = 'http://geo.irceline.be/sos/api/v1/';

  public fitBounds: L.LatLngBoundsExpression = [[49.5, 3.27], [51.5, 5.67]];
  public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
  public avoidZoomToSelection = false;
  public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
  public cluster = false;
  public loadingStations: boolean;
  public stationFilter: ParameterFilter = {
    // phenomenon: '8'
  };
  public statusIntervals = false;
  public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };

  public searchOptions: GeoSearchOptions = { countrycodes: [] };

  public onStationSelected(station: Station) {
    console.log('Clicked station: ' + station.properties.label);
  }

  public onSelectPhenomenon(phenomenon: Phenomenon) {
    console.log('Select: ' + phenomenon.label + ' with ID: ' + phenomenon.id);
    this.stationFilter = {
      phenomenon: phenomenon.id
    };
  }

}
```

#### `src/app/app.module.ts`
```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Add dependencies for helgoland components.
import { GeoSearch, HelgolandMapControlModule, HelgolandMapSelectorModule, NominatimGeoSearchService } from '@helgoland/map';
import { DatasetApiInterface, SettingsService, SplittedDataDatasetApiInterface } from '@helgoland/core';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { ExtendedSettingsService } from './settings/settings.service';

// Add dependencies for translations.
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    HelgolandSelectorModule,
    HelgolandDatasetlistModule
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    {
      provide: GeoSearch,
      useClass: NominatimGeoSearchService
    },
    {
      provide: SettingsService,
      useClass: ExtendedSettingsService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
```

#### `src/tsconfig.json`
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "es2015",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es5",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ],
    "paths": {
        "@angular/*":["node_modules/@angular/*"],
    }
  }
}
```
