import { Injectable } from "@angular/core";
import moment from "moment";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";

import { HttpService } from "../../../dataset-api/http.service";
import { InternalDatasetId } from "../../../dataset-api/internal-id-handler.service";
import { Category } from "../../../model/dataset-api/category";
import { ReferenceValues, TimeValueTuple } from "../../../model/dataset-api/data";
import { FirstLastValue, ParameterConstellation, ReferenceValue, RenderingHints } from "../../../model/dataset-api/dataset";
import { Feature } from "../../../model/dataset-api/feature";
import { Offering } from "../../../model/dataset-api/offering";
import { Phenomenon } from "../../../model/dataset-api/phenomenon";
import { Procedure } from "../../../model/dataset-api/procedure";
import { Timespan } from "../../../model/internal/timeInterval";
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from "../../helgoland-services-connector";
import { HelgolandServiceConnector } from "../../interfaces/service-connector-interfaces";
import { HelgolandData, HelgolandDataFilter, HelgolandTimeseriesData } from "../../model/internal/data";
import {
  DatasetExtras,
  DatasetFilter,
  DatasetType,
  HelgolandDataset,
  HelgolandTimeseries,
} from "../../model/internal/dataset";
import { HelgolandCsvExportLinkParams, HelgolandParameterFilter } from "../../model/internal/filter";
import { HelgolandPlatform } from "../../model/internal/platform";
import { HelgolandService } from "../../model/internal/service";
import { Datastream, DatastreamExpandParams, DatastreamSelectParams } from "./model/datasetreams";
import { Location, LocationExpandParams, LocationSelectParams } from "./model/locations";
import { Observation } from "./model/observations";
import { ObservedProperty, ObservedPropertyExpandParams, ObservedPropertySelectParams } from "./model/observed-properties";
import { Sensor, SensorExpandParams, SensorSelectParams } from "./model/sensors";
import { StaExpandParams, StaFilter, StaSelectParams, StaValueListResponse } from "./model/sta-interface";
import { Thing, ThingExpandParams, ThingSelectParams } from "./model/things";
import { StaReadInterfaceService } from "./read/sta-read-interface.service";

const DEFAULT_SERVICE_LABEL = "OGC SensorThings API";
const DEFAULT_SERVICE_ID = "1";

@Injectable({
  providedIn: "root"
})
export class StaApiV1Connector implements HelgolandServiceConnector {

  name = "StaApiV1Connector";

  constructor(
    protected http: HttpService,
    protected sta: StaReadInterfaceService
  ) { }

  canHandle(url: string): Observable<boolean> {
    return this.http.client().get(url).pipe(
      map((res: any) => {
        if (res && res.value && res.value instanceof Array) {
          // check if endpoint 'Things' exists
          return res.value.findIndex((e: any) => e.name === "Things") >= 0;
        } else {
          return false;
        }
      }),
      catchError((err) => {
        console.error(err);
        return of(false);
      })
    );
  }

  getServices(apiUrl: string, params: HelgolandParameterFilter): Observable<HelgolandService[]> {
    return this.createServices(apiUrl, params);
  }

  getService(id: string, url: string, params: HelgolandParameterFilter): Observable<HelgolandService> {
    return this.createServices(url, params).pipe(map(res => res[0]));
  }

  getCategories(url: string, filter: HelgolandParameterFilter): Observable<Category[]> {
    if (this.filterTimeseriesMatchesNot(filter)) { return of([]); }
    return this.sta.aggregatePaging(this.sta.getObservedProperties(url, this.createCategoriesFilter(filter)))
      .pipe(map(obProps => obProps.value.map(e => this.createCategory(e))));
  }

  getCategory(id: string, url: string, filter: HelgolandParameterFilter): Observable<Category> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError(() => new Error("Could not create category")); }
    return this.sta.getObservedProperty(url, id).pipe(map(prop => this.createCategory(prop)));
  }

  getOfferings(url: string, filter: HelgolandParameterFilter): Observable<Offering[]> {
    if (this.filterTimeseriesMatchesNot(filter)) { return of([]); }
    return this.sta.aggregatePaging(this.sta.getThings(url, this.createOfferingsFilter(filter)))
      .pipe(map(things => things.value.map(t => this.createOffering(t))));
  }

  protected createOfferingsFilter(params: HelgolandParameterFilter): StaFilter<ThingSelectParams, ThingExpandParams> {
    if (params) {
      const filterList: string[] = [];
      return this.createFilter(filterList);
    }
    throw new Error("Could not create OfferingsFilter.");
  }

  getOffering(id: string, url: string, filter: HelgolandParameterFilter): Observable<Offering> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError("Could not create offering"); }
    return this.sta.getThing(url, id).pipe(map(t => this.createOffering(t)));
  }

  getPhenomena(url: string, filter: HelgolandParameterFilter): Observable<Phenomenon[]> {
    if (this.filterTimeseriesMatchesNot(filter)) { return of([]); }
    const staFilter = this.createPhenomenaFilter(filter);
    return this.sta.aggregatePaging(this.sta.getObservedProperties(url, staFilter))
      .pipe(map(obsProps => obsProps.value.map(e => this.createPhenomenon(e))));
  }

  protected createPhenomenaFilter(params: HelgolandParameterFilter): StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams> {
    if (params) {
      const filterList: string[] = ["Datastreams/properties/hidden ne true"];
      if (params.category) {
        filterList.push(`id eq '${params.category}'`);
      }
      if (params.feature) {
        filterList.push(`Datastreams/Thing/Locations/id eq '${params.feature}'`);
      }
      return this.createFilter(filterList);
    }
    throw new Error("Could not create PhenomenaFilter.");
  }

  getPhenomenon(id: string, url: string, filter: HelgolandParameterFilter): Observable<Phenomenon> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError("Could not create phenomenon"); }
    return this.sta.getObservedProperty(url, id).pipe(map(prop => this.createPhenomenon(prop)));
  }

  getProcedures(url: string, filter: HelgolandParameterFilter): Observable<Procedure[]> {
    if (this.filterTimeseriesMatchesNot(filter)) { return of([]); }
    return this.sta.aggregatePaging(this.sta.getSensors(url, this.createProceduresFilter(filter)))
      .pipe(map(sensors => sensors.value.map(s => this.createProcedure(s))));
  }

  protected createProceduresFilter(params: HelgolandParameterFilter): StaFilter<SensorSelectParams, SensorExpandParams> {
    if (params) {
      const filterList: string[] = [];
      if (params.category) {
        filterList.push(`Datastreams/ObservedProperty/id eq '${params.category}'`);
      }
      // if (params.feature) {
      //     filterList.push(`Datastreams/Thing/Locations/id eq '${params.feature}'`);
      // }
      if (params.phenomenon) {
        filterList.push(`Datastreams/ObservedProperty/id eq '${params.category}'`);
      }
      return this.createFilter(filterList);
    }
    return {};
  }

  getProcedure(id: string, url: string, filter: HelgolandParameterFilter): Observable<Procedure> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError("Could not create procedure"); }
    return this.sta.getSensor(url, id).pipe(map(sensor => this.createProcedure(sensor)));
  }

  getFeatures(url: string, filter: HelgolandParameterFilter): Observable<Feature[]> {
    if (this.filterTimeseriesMatchesNot(filter)) { return of([]); }
    return this.sta.aggregatePaging(this.sta.getLocations(url, this.createFeaturesFilter(filter)))
      .pipe(map(locs => locs.value.map(l => this.createFeature(l))));
  }

  protected createFeaturesFilter(params: HelgolandParameterFilter): StaFilter<LocationSelectParams, LocationExpandParams> {
    if (params) {
      const filterList: string[] = [];
      if (params.category) {
        filterList.push(`Things/Datastreams/ObservedProperty/id eq '${params.category}'`);
      }
      if (params.phenomenon) {
        filterList.push(`Things/Datastreams/ObservedProperty/id eq '${params.phenomenon}'`);
      }
      if (params.procedure) {
        filterList.push(`Things/Datastreams/Sensor/id eq '${params.procedure}'`);
      }
      return this.createFilter(filterList);
    }
    throw new Error("Could not create FeaturesFilter.");
  }

  getFeature(id: string, url: string, filter: HelgolandParameterFilter): Observable<Feature> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError("Could not create feature"); }
    return this.sta.getLocation(url, id).pipe(map(loc => this.createFeature(loc)));
  }

  getPlatforms(url: string, filter: HelgolandParameterFilter): Observable<HelgolandPlatform[]> {
    if (this.filterTimeseriesMatchesNot(filter)) { return of([]); }
    return this.sta.aggregatePaging(this.sta.getLocations(url, this.createStationFilter(filter)))
      .pipe(map(locs => locs.value.map(e => this.createHelgolandPlatform(e))));
  }

  getPlatform(id: string, url: string, filter: HelgolandParameterFilter): Observable<HelgolandPlatform> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError("Could not create platform"); }
    // return this.sta.getLocation(url, id, { $expand: "Things/Datastreams/Thing,Things/Locations,Things/Datastreams/ObservedProperty,Things/Datastreams/Sensor" })
    //   .pipe(map(loc => this.createExtendedPlatform(loc)));
    return this.sta.getLocation(url, id, { $expand: "Things($expand=Locations,Datastreams($filter=properties/hidden ne true;$expand=Thing,Sensor,ObservedProperty))" })
      .pipe(map(loc => this.createExtendedPlatform(loc)));
  }

  protected createCategoriesFilter(params: HelgolandParameterFilter): StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams> {
    if (params) {
      const filterList: string[] = [];
      if (params.phenomenon) {
        filterList.push(`id eq '${params.phenomenon}'`);
      }
      if (params.feature) {
        filterList.push(`Datastreams/Thing/Locations/id eq '${params.feature}'`);
      }
      if (params.procedure) {
        filterList.push(`Datastreams/Sensor/id eq '${params.procedure}'`);
      }
      return this.createFilter(filterList);
    }
    throw new Error("Could not create CategoriesFilter.");
  }

  protected createStationFilter(filter: HelgolandParameterFilter): StaFilter<LocationSelectParams, LocationExpandParams> {
    if (filter && filter.phenomenon) {
      return { $filter: `Things/Datastreams/ObservedProperty/id eq '${filter.phenomenon}'` };
    }
    return {};
  }

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    if (this.filterTimeseriesMatchesNot(filter)) { return of([]); }
    if (filter.expanded) {
      const firstFilter = this.createDatastreamFilter(filter);
      const firstExpandFilter = "Observations($orderby=phenomenonTime desc;$top=1)";
      firstFilter.$expand = firstFilter.$expand ? firstFilter.$expand + `,${firstExpandFilter}` : firstExpandFilter;

      const lastFilter: StaFilter<DatastreamSelectParams, DatastreamExpandParams> = {};
      lastFilter.$expand = "Observations($orderby=phenomenonTime;$top=1)";
      lastFilter.$select = {
        Observations: true,
        id: true
      }

      const firstRequest = this.sta.aggregatePaging(this.sta.getDatastreams(url, firstFilter));
      const lastRequest = this.sta.aggregatePaging(this.sta.getDatastreams(url, lastFilter));
      return forkJoin({ first: firstRequest, last: lastRequest }).pipe(map(res => {
        return res.first.value.map(ds => {
          const first = this.getFirstLast(ds.Observations);
          const match = res.last.value.find(e => e["@iot.id"] === ds["@iot.id"]);
          const last = this.getFirstLast(match?.Observations);
          return this.createExpandedTimeseries(ds, first, last, [], url);
        })
      }));
    } else {
      return this.sta.aggregatePaging(this.sta.getDatastreams(url, this.createDatastreamFilter(filter)))
        .pipe(map(ds => ds.value.map(d => this.createTimeseries(d, url))))
    }
  }

  private getFirstLast(obs: Observation[] | undefined) {
    let firstLast: FirstLastValue | undefined;
    if (obs?.length === 1) {
      const { phenomenonTime, result } = obs[0];
      firstLast = new FirstLastValue();
      if (phenomenonTime) {
        firstLast.timestamp = new Date(phenomenonTime).getTime();
      }
      if (typeof result === "number") {
        firstLast.value = result;
      }
    }
    return firstLast;
  };

  protected createDatastreamFilter(params: DatasetFilter): StaFilter<DatastreamSelectParams, DatastreamExpandParams> {
    let filter: StaFilter<StaSelectParams, StaExpandParams> = {};
    if (params) {
      const filterList: string[] = [];
      if (params.phenomenon) {
        filterList.push(`ObservedProperty/id eq '${params.phenomenon}'`);
      }
      if (params.category) {
        filterList.push(`ObservedProperty/id eq '${params.category}'`);
      }
      if (params.procedure) {
        filterList.push(`Sensor/id eq '${params.procedure}'`);
      }
      if (params.feature) {
        filterList.push(`Thing/Locations/id eq '${params.feature}'`);
      }
      filter = this.createFilter(filterList);
    }
    filter.$expand = "Thing,Thing/Locations,ObservedProperty,Sensor";
    return filter;
  }

  protected createFirstLastValue(obs: Observation): FirstLastValue | undefined {
    if (obs && obs.phenomenonTime && obs.result) {
      return { timestamp: new Date(obs.phenomenonTime).valueOf(), value: parseFloat(obs.result) };
    }
    return undefined;
  }

  protected createTimeFilter(time: string): string {
    return `phenomenonTime eq ${time}`;
  }

  getDataset(internalId: InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError("Could not create dataset"); }
    const firstFilter: StaFilter<DatastreamSelectParams, DatastreamExpandParams> = {
      $expand: "Thing,Thing/Locations,ObservedProperty,Sensor,Observations($orderby=phenomenonTime;$top=1)"
    };
    const lastFilter: StaFilter<DatastreamSelectParams, DatastreamExpandParams> = {
      $expand: "Thing,Thing/Locations,ObservedProperty,Sensor,Observations($orderby=phenomenonTime desc;$top=1)",
      $select: { Observations: true, id: true }
    };
    const firstRequest = this.sta.getDatastream(internalId.url, internalId.id, firstFilter);
    const lastRequest = this.sta.getDatastream(internalId.url, internalId.id, lastFilter);
    return forkJoin({ first: firstRequest, last: lastRequest }).pipe(
      mergeMap(res => {
        const first = this.getFirstLast(res.first.Observations);
        const last = this.getFirstLast(res.last.Observations);
        if (res.first.properties?.["referenceDatastreamList"]) {
          const refValueIds: string[] = res.first.properties?.["referenceDatastreamList"];
          const req = refValueIds.map(id => this.sta.getDatastream(internalId.url, id, {
            $expand: "Thing,Observations($orderby=phenomenonTime desc;$top=1)",
          }));
          return forkJoin(req).pipe(
            map(refValueDs => {
              const refValues = refValueDs.map(ds => {
                const id = ds["@iot.id"];
                const last = this.getFirstLast(ds.Observations);
                const parameter = this.createTsParameter(ds, ds.Thing!);
                const name = this.createTimeseriesName(ds, parameter);
                return new ReferenceValue(id, name, last);
              })
              return this.createExpandedTimeseries(res.first, first, last, refValues, internalId.url);
            })
          );
        } else {
          return of(this.createExpandedTimeseries(res.first, first, last, [], internalId.url));
        }
      })
    );
  }

  getDatasetData(dataset: HelgolandTimeseries, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
    const timeFilter = this.createTimespanFilter(timespan);
    const mainDataReq = this.createDatasetDataRequest(dataset.id, dataset.url, timeFilter);
    if (filter.expanded) {
      const requests: { [key: string]: Observable<StaValueListResponse<Observation>> } = { main: mainDataReq };
      dataset.referenceValues.forEach(rv => {
        requests[rv.referenceValueId] = this.createDatasetDataRequest(rv.referenceValueId, dataset.url, timeFilter);
      });
      return forkJoin(requests).pipe(map(res => {
        const refValues = new ReferenceValues<TimeValueTuple>();
        dataset.referenceValues.forEach(e => refValues[e.referenceValueId] = { values: this.createTimeValueTuple(res[e.referenceValueId].value) })
        return new HelgolandTimeseriesData(this.createTimeValueTuple(res["main"].value), refValues)
      }));
    } else {
      return mainDataReq.pipe(map(res => new HelgolandTimeseriesData(this.createTimeValueTuple(res.value))));
    }
  }

  private createDatasetDataRequest(id: string, url: string, timeFilter: string) {
    return this.sta.aggregatePaging(
      this.sta.getDatastreamObservationsRelation(url, id, { $orderby: "phenomenonTime", $filter: timeFilter, $top: 1000 })
    );
  }

  createCsvDataExportLink(internalId: string | InternalDatasetId, params: HelgolandCsvExportLinkParams): Observable<string> {
    return throwError("Could not create csv data export link");
  }

  getDatasetExtras(internalId: InternalDatasetId): Observable<DatasetExtras> {
    return of({});
  }

  protected createTimespanFilter(timespan: Timespan): string {
    const format = "YYYY-MM-DDTHH:mm:ss.SSSZ";
    return `phenomenonTime ge ${moment(timespan.from).format(format)} and phenomenonTime le ${moment(timespan.to).format(format)}`;
  }

  protected createHelgolandPlatform(loc: Location): HelgolandPlatform {
    if (loc["@iot.id"] && loc.name) {
      return new HelgolandPlatform(loc["@iot.id"], loc.name, [], loc.location);
    }
    throw new Error("Could not create helgoland platform");
  }

  protected createExtendedPlatform(loc: Location): HelgolandPlatform {
    const platform = this.createHelgolandPlatform(loc);
    loc.Things?.forEach(thing => {
      thing.Datastreams?.forEach(ds => {
        platform.datasetIds.push(`${ds["@iot.id"]}`);
      });
    });
    return platform;
  }

  protected createTimeseries(ds: Datastream, url: string): HelgolandDataset {
    if (ds["@iot.id"] && ds.name) return new HelgolandDataset(ds["@iot.id"], url, ds.name);
    throw new Error("Could not create helgoland timeseries");
  }

  protected createTsParameter(ds: Datastream, thing: Thing): ParameterConstellation {
    const parameters: ParameterConstellation = {};
    parameters.service = { id: DEFAULT_SERVICE_ID, label: DEFAULT_SERVICE_LABEL };
    parameters.offering = this.createOffering(thing);
    if (thing.Locations?.length) parameters.feature = this.createFeature(thing.Locations[0]);
    if (ds.Sensor) parameters.procedure = this.createProcedure(ds.Sensor);
    if (ds.ObservedProperty) parameters.phenomenon = this.createPhenomenon(ds.ObservedProperty);
    if (ds.ObservedProperty) parameters.category = this.createCategory(ds.ObservedProperty);
    return parameters;
  }

  private createExpandedTimeseries(ds: Datastream, first: FirstLastValue | undefined, last: FirstLastValue | undefined, refValues: ReferenceValue[], url: string): HelgolandTimeseries {
    if (ds["@iot.id"] && ds.unitOfMeasurement?.symbol && ds.Thing?.Locations) {
      const id = ds["@iot.id"];
      const symbol = ds.unitOfMeasurement?.symbol;
      const platform = this.createHelgolandPlatform(ds.Thing.Locations[0]);
      const parameter = this.createTsParameter(ds, ds.Thing);
      const name = this.createTimeseriesName(ds, parameter);
      const renderingHints: RenderingHints | undefined = ds.properties?.["renderingHints"] || undefined;
      return new HelgolandTimeseries(id, url, name, symbol, platform, first, last, refValues, renderingHints, parameter);
    }
    throw new Error("Could not create feature.");
  }

  private createTimeseriesName(ds: Datastream, parameter: ParameterConstellation) {
    if (ds.name) {
      return ds.name;
    }
    if (parameter.phenomenon?.label && parameter.feature?.label) {
      return `${parameter.phenomenon.label} @ ${parameter.feature.label}`;
    }
    throw new Error(`Could not create name for this datastream: ${ds}`);
  }

  protected createTimeValueTuple(observations: Observation[]): TimeValueTuple[] {
    return observations
      .filter(obs => obs.phenomenonTime)
      .map(obs => [new Date(obs.phenomenonTime!).getTime(), parseFloat(obs.result as string)] as TimeValueTuple);
  }

  protected createFeature(loc: Location): Feature {
    if (loc["@iot.id"] && loc.name) return { id: loc["@iot.id"], label: loc.name }
    throw new Error("Could not create feature.");
  }

  protected createOffering(thing: Thing): Offering {
    if (thing["@iot.id"] && thing.name) return { id: thing["@iot.id"], label: thing.name };
    throw new Error("Could not create offering.");
  }

  protected createPhenomenon(obsProp: ObservedProperty): Phenomenon {
    if (obsProp["@iot.id"] && obsProp.name) return { id: obsProp["@iot.id"], label: obsProp.name };
    throw new Error("Could not create phenomenon.");
  }

  protected createCategory(obsProp: ObservedProperty): Category {
    if (obsProp["@iot.id"] && obsProp.name) return { id: obsProp["@iot.id"], label: obsProp.name };
    throw new Error("Could not create category.");
  }

  protected createProcedure(sensor: Sensor): Procedure {
    if (sensor["@iot.id"] && sensor.name) return { id: sensor["@iot.id"], label: sensor.name };
    throw new Error("Could not create procedure.");
  }

  protected createServices(url: string, paramfilter: HelgolandParameterFilter): Observable<HelgolandService[]> {
    const service = new HelgolandService(
      DEFAULT_SERVICE_ID,
      url,
      DEFAULT_SERVICE_LABEL,
      "STA",
      "1.0",
      {
        categories: 0,
        features: 0,
        offerings: 0,
        phenomena: 0,
        procedures: 0,
        platforms: 0,
        datasets: 0
      }
    );
    if (paramfilter.type && paramfilter.type !== DatasetType.Timeseries) {
      return of([service]);
    }
    const filter = { $count: true, $top: 1 };
    const locationsReq = this.sta.getLocations(url, filter);
    const obPropsReq = this.sta.getObservedProperties(url, filter);
    const thingsReq = this.sta.getThings(url, filter);
    const sensorsReq = this.sta.getSensors(url, filter);
    const datastreamsReq = this.sta.getDatastreams(url, filter);
    return forkJoin([locationsReq, obPropsReq, thingsReq, sensorsReq, datastreamsReq]).pipe(map(res => {
      service.quantities!.categories = res[1]["@iot.count"];
      service.quantities!.features = res[0]["@iot.count"];
      service.quantities!.offerings = res[2]["@iot.count"];
      service.quantities!.phenomena = res[1]["@iot.count"];
      service.quantities!.procedures = res[3]["@iot.count"];
      service.quantities!.platforms = res[0]["@iot.count"];
      service.quantities!.datasets = res[4]["@iot.count"];
      return [service];
    }));
  }

  // protected createPlatform(loc: Location): Platform {
  //   return {
  //     id: loc['@iot.id'],
  //     label: loc.name,
  //     platformType: PlatformTypes.stationary,
  //     datasets: [],
  //     geometry: loc.location as GeoJSON.Point,
  //   };
  // }

  protected createFilter(filterList: string[]): StaFilter<StaSelectParams, StaExpandParams> {
    if (filterList.length > 0) {
      return { $filter: filterList.join(" and ") };
    }
    return {};
  }

  protected filterTimeseriesMatchesNot(filter: HelgolandParameterFilter): boolean {
    return (filter.type && filter.type !== DatasetType.Timeseries) || false;
  }

}

export const DatasetStaConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: StaApiV1Connector,
  multi: true
};
