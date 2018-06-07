# Introduction

> tools for a sensor observation service based client

This project contains [Angular](https://angular.io/) based Modules, Components, Injectables to build a sensor observation service based client. It is divided in different Modules to support specific needs. Currently the toolbox comprise the following modules:

- `core` - Dataset-Api communication and response model, important services (local storage), important interfaces
- `caching` - http request caching for completed and running requests
- `control` - some ui controls (e.g. toggle button)
- `depiction` - components to show data or metadata (e.g. dataset data table, timeseries entry, label-mapper)
- `favorite` - components and services to handle datasets in favorites
- `map` - components to display leaflet maps for view or selection, and also some map controls (geo-search, locate, zoom)
- `modification` - dataset modification (color or other graph represent points)
- `permalink` - components to generate permalinks and service to resolve them
- `selector` - components for dataset selection (list, filter, service)
- `time` - components to manipulate/select timeperiods or timestamps
- `flot` - timeseries graph presentation with [Flot](https://www.flotcharts.org/)
- `plotly` - profile graph presentation with [plotly.js](https://plot.ly/plotly-js-scientific-d3-charting-library/)
- `d3` - timeseries and trajectory graph presentation with [D3.js](https://d3js.org/)


## Dataset handling

### Internal dataset id generation

For a better handling of datasets of different APIs, there exists an internal strategy to create dataset ids out of the url of an API and the API specific dataset ID.
The generation and resolving of this internal ID is handled in the [InternalIdHandler](../injectables/InternalIdHandler.html)
