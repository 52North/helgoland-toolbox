# Introduction

> tools for a sensor observation service based client

This project contains [Angular](https://angular.io/) based Modules, Components, Injectables to build a sensor observation service based client. It is divided in different Modules to support specific needs. Currently the toolbox comprise the following modules:

- `auth` - Currently with a basic-auth handling
- `caching` - http request caching for completed and running requests
- `control` - some ui controls (e.g. toggle button)
- `core` - Dataset-Api communication and response model, important services (local storage), important interfaces
- `d3` - timeseries and trajectory graph presentation with [D3.js](https://d3js.org/)
- `depiction` - components to show data or metadata (e.g. dataset data table, timeseries entry, label-mapper)
- `eventing` - describes the model of the eventing API and has an interface to communicate with the API
- `favorite` - components and services to handle datasets in favorites
- `flot` - timeseries graph presentation with [Flot](https://www.flotcharts.org/)
- `map` - components to display leaflet maps for view or selection, and also some map controls (geo-search, locate, zoom)
- `modification` - dataset modification (color or other graph represent points)
- `permalink` - components to generate permalinks and service to resolve them
- `plotly` - profile graph presentation with [plotly.js](https://plot.ly/plotly-js-scientific-d3-charting-library/)
- `selector` - components for dataset selection (list, filter, service)
- `time` - components to manipulate/select timeperiods or timestamps

## Dataset handling

### Internal dataset id generation

For a better handling of datasets of different APIs, there exists an internal strategy to create dataset ids out of the url of an API and the API specific dataset ID.
The generation and resolving of this internal ID is handled in the [InternalIdHandler](../injectables/InternalIdHandler.html)

> Example: For a dataset with the id `123` of the service api `https://www.sample.de/api/v1/` the internal id looks like `https://www.sample.de/api/v1/__123`
