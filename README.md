# helgoland-toolbox

> tools for a sensor observation service based client

[![npm version](https://badge.fury.io/js/%40helgoland%2Fcore.svg)](https://badge.fury.io/js/%40helgoland%2Fcore)
<!-- [![dependencies Status](https://david-dm.org/52north/helgoland-toolbox/status.svg)](https://david-dm.org/52north/helgoland-toolbox)
[![devDependencies Status](https://david-dm.org/52north/helgoland-toolbox/dev-status.svg)](https://david-dm.org/52north/helgoland-toolbox?type=dev) -->

This project contains [Angular](https://angular.io/) based Modules, Components, Injectables to build a sensor observation service based client. 

## Description

### Tools for Building Web Applications
**Providing Reusable Components for Building (Sensor Web) Client Applications**

52°North created the Helgoland Toolbox to facilitate the reuse of developments for Sensor Web client applications. It provides a range of modules that offer functionalities for building Web applications dealing with dynamic spatio-temporal data. The Helgoland Toolbox modules are used to build the 52°North Helgoland Sensor Web Viewer. Additional applications (e.g. the BelAir app, smle, or the developments resulting from the TaMIS project) are also built upon this library.

**Features:**

The most important functional modules comprise:

Core
- Communication with the APIs
- Important common services (local storage, time)
- Central interfaces and abstract classes

Caching
- Request Caching with Angular Interceptors

d3
- Trajectory Graph component
- Time Series Graph component

Depiction
- Legend entries
- Table view of data

Map
- Controls (Geo-Search, Locate, Zoom, Extent)
- Map Selector component

Selectors
- List Selector for observation data
- Service Selector for data sources

The work on the Helgoland Toolbox comprised several evolutionary improvements and enhancements that were developed as part of several projects (e.g. WaCoDiS, MuDak-WRM. SeaDataCloudk BSH, Wupperverband Framework Contract). This include:

- Enhancement to connect to instances of the OGC SensorThings API
- Improved caching
- Complementary mapping module based on open layers to support time-dependent background map layers
- Enhanced data export functionality
- Improvements in the diagram visualization
- Facet search for observation data

<p align="center">
  <img src="https://user-images.githubusercontent.com/3830314/81534731-d1905380-9368-11ea-8c6f-213b96dd5c41.jpg" alt="Helgoland map view" width="75%"/>
</p>

**Key Technologies:**

- JavaScript
- TypeScript
- Angular
- Leaflet
- d3
- Open Layers

**Benefits:**

 - Reusable components for building client applications
 - Modules for visualizing different types of sensor data (time series, trajectories, profiles)
 - Mapping modules
 - Different components for data selection
 
## Quick Start

### Dependencies

#### Node/NPM

Install latest Node and NPM following the [instructions](https://nodejs.org/en/download/). Make sure you have Node version ≥ 7.0 and NPM ≥ 4.

- `brew install node` for Mac.

### Installing

- `fork` this repository.
- `clone` your fork to your local environment.
- `npm install` to install required dependencies.

### Build the libraries

- `npm run build:libs` for building the library once

### Other commands

#### Lint the complete code

- `ng lint` for performing static code analysis.

#### Generate documentation

- `npm run compodoc` for generating documentation locally
- `npm run gh-pages` for generating documentation and uploading it to GitHub Pages

##### Bump library version

- `npm version ***` to increase library version. [More on bumping](https://docs.npmjs.com/cli/version).

<!-- `preversion` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing. -->

##### Publish library to NPM

- `yarn lib:publish` to publish your library sources on [npmjs.com](https://www.npmjs.com/). Once the library is published it will be available for usage in npm packages.

<!-- `prepublishOnly` script in this case will automatically run project testing and linting in prior in order to check that the library is ready for publishing. -->

### Using demo applications

 - just start the demo with `ng serve` and the demo is published 

<!-- #### Using `yarn link`

In you library root folder:

```bash
# Create symbolic link
yarn link

# Build library in watch mode
yarn build:watch
```

In you project folder that should consume the library:

```bash
# Link you library to the project
yarn link "angular-library-seed"

# Build your project. In case of Angular-CLI use the following command.
ng serve --aot
```

Then you need to import your library into your project's source code.

Now, once you update your library source code it will automatically be re-compiled and your project will be re-built so you may see library changes instantly.

[More information](https://yarnpkg.com/en/docs/cli/link) about `yarn link` command.

> At the moment of publishing this project there is a [bug](https://github.com/angular/angular-cli/issues/3854) exists when using `yarn link` in combination with Angular CLI. The issue is caused by having `node_modules` folder inside linked library. There is a [workaround](https://github.com/angular/angular-cli/issues/3854#issuecomment-274344771) has been provided that suggests to add a `paths` property with all Angular dependencies to the `tsconfig.json` file of the Angular CLI project like it is shown below:

```
{
  "compilerOptions": {
    "paths": { "@angular/*": ["../node_modules/@angular/*"] }
  }
}
``` -->

## Supported series API versions mapping

| helgoland-toolbox version | [series rest API](https://github.com/52North/series-rest-api) version |
|:-------------------------:|:---------------------------------------------------------------------:|
| v0.0.1-alpha.53           | v1.10.2                                                               |

## Troubleshooting while using this library

- add `allowSyntheticDefaultImports: true` to your tsconfig.json to avoid error messages like `... has no default export`
- don't forget to add styles of nested dependencies


## References

- [INSPIRE Download Service](http://inspire.ec.europa.eu/id/document/tg/download-sos) 
- [Federal Maritime and Hydrographic Agency (BSH)](https://www.bsh.de/)
- [Wupperverband](https://www.wupperverband.de/)
- [SeaDataCloud](https://www.seadatanet.org/About-us/SeaDataCloud)
- [WaCoDiS](https://wacodis.fbg-hsbo.de/)
- [MuDak-WRM](https://www.mudak-wrm.kit.edu/)
- [mVIZ](https://mviz.geo.tu-dresden.de/)
- [IRCEL-CELINE BelAir](https://52north.org/references/belair/)
