# How to integrate a table component

In the current development, we have integrated a middleware communication level. Currently there exists four connectors with their corresponding providers, which must be configured in the providers section:

- `DatasetApiV1Connector` - `DatasetApiV1ConnectorProvider`
- `DatasetApiV2Connector` - `DatasetApiV2ConnectorProvider`
- `DatasetApiV3Connector` - `DatasetApiV3ConnectorProvider`
- `DatasetSTAConnector` - `DatasetStaConnectorProvider`

There is a mechanism to detect the correct connector to every configured service url. But to reduce requests for this auto detect mechanism you can also configure to every service url the corresponding connector in the following way:

```json
{
  "name": "instance1",
  "url": "https://url-to-instance1-api/",
  "connector": "DatasetApiV1Connector"
},
{
  "name": "instance2",
  "url": "https://url-to-instance2-api/",
  "connector": "StaApiConnector"
},
```

Steps to migrate:

- add providers of the connectors which you need to your module configuration
- use [`HelgolandServicesConnector`](../../../documentation/injectables/HelgolandServicesConnector.html) to communicate with the different services via their connectors, by replacing `DatasetApiInterface`. Some methods of the new communication interface are slightly different, but hopefully self explained.
  - use `HelgolandParameterFilter` where you need filtering your requests instead of previously used `ParameterFilter`
  - with the `getDatasets` request, you get a list of basic datasets `HelgolandDataset`. If you use the `DatasetType` in the filters, you can get specified Datasets in the response array. The single `getDataset` request works equivalent. Currently there are 3 different types of dataset available: 
    - `HelgolandTimeseries`
    - `HelgolandTrajectory`
    - `HelgolandProfile`
  - So replace previous structures as `Dataset`, `Timeseries`, ... with `HelgolandDataset`, `HelgolandTimeseries`, ...
- `HelgolandPlatform` replaces the old Structure of `Station` or `Platform`
- component `n52-platform-map-selector` is removed, use instead `n52-station-map-selector`
