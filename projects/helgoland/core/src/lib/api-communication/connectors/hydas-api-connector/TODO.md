# HyDAS API Connector – open issues

As of: 2026-09-30 · Connector: [`hydas-api-connector.ts`](./hydas-api-connector.ts) · API docs: <https://pegelonline.wsv.de/webservice/hydas> (beta)

## 1. Parameters can only be fetched per station

The API only provides parameters via `/stations/{stationId}/parameters`. If `getPhenomena`, `getDatasets` or `getProcedures` are called without a station filter (`feature`/`platform`), the connector requests the parameters of all stations – about 786 requests for PEGELONLINE (max. 8 in parallel, cached afterwards).

Possible solutions:

- propose a server-side endpoint such as `/parameters` (possibly with a `stationIds` filter)
- restrict the selection in the UI to station → parameter

## 2. First/last value without values

`firstValue`/`lastValue` are derived from `availability` and only contain timestamps, no measured value. Getting the last value would require an additional `values` request (e.g. `from` = `availability.end` − `interval`).

## 3. `valueBeforeTimespan` / `valueAfterTimespan` are missing

`getDatasetData` requests exactly the `from`/`to` of the timespan. For the graph to be drawn through to the edges, the window would have to be extended by one `interval` and the boundary values set separately.

## 4. Registration and configuration

- `HydasApiConnectorProvider` is not yet registered in `src/main.ts` or `projects/helgoland-timeseries/src/main.ts`.
- The service URL (`https://pegelonline.wsv.de/api/v1`) is missing from the settings.
- `canHandle` triggers one request per configured URL (`stations?ids=<nil UUID>`).

## 5. No cache invalidation

Stations and parameters are kept in memory permanently per URL or station (`shareReplay`). This is mostly uncritical for metadata, but e.g. new stations or changed parameters only show up after a reload. Consider adding a TTL or manual clearing.

## Observations on the API

- `availability` only goes back about 31 days – older time ranges return no data.
- `values` without `from`/`to` returns the entire available time range, not just the last value.
- `status.message` is missing from the responses, although the docs list the field as required.
- An unknown parameter returns `400 BAD_REQUEST` instead of `404`.
- `/stations/` with a trailing slash returns `404` (HTML page).
