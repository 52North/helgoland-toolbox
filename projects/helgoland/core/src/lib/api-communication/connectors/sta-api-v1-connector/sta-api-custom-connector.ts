import { Injectable } from "@angular/core";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

import { HttpService } from "../../../dataset-api/http.service";
import { InternalDatasetId } from "../../../dataset-api/internal-id-handler.service";
import { Category } from "../../../model/dataset-api/category";
import { ReferenceValues, TimeValueTuple } from "../../../model/dataset-api/data";
import { ParameterConstellation, ReferenceValue } from "../../../model/dataset-api/dataset";
import { Timespan } from "../../../model/internal/timeInterval";
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from "../../helgoland-services-connector";
import { HelgolandData, HelgolandDataFilter, HelgolandTimeseriesData } from "../../model/internal/data";
import { DatasetFilter, HelgolandDataset, HelgolandTimeseries } from "../../model/internal/dataset";
import { HelgolandParameterFilter } from "../../model/internal/filter";
import { HelgolandPlatform } from "../../model/internal/platform";
import { Datastream, DatastreamExpandParams, DatastreamSelectParams } from "./model/datasetreams";
import { LocationExpandParams, LocationSelectParams } from "./model/locations";
import { Observation } from "./model/observations";
import { ObservedPropertyExpandParams, ObservedPropertySelectParams } from "./model/observed-properties";
import { SensorExpandParams, SensorSelectParams } from "./model/sensors";
import { StaExpandParams, StaFilter, StaSelectParams, StaValueListResponse } from "./model/sta-interface";
import { Thing } from "./model/things";
import { StaApiV1Connector } from "./sta-api-v1-connector";
import { StaInterfaceService } from "./sta-interface.service";

const DEFAULT_SERVICE_LABEL = "OGC SensorThings API";
const DEFAULT_SERVICE_ID = "1";

@Injectable({
  providedIn: "root"
})
export class StaApiCustomConnector extends StaApiV1Connector {

  override name = "StaApiCustomConnector";

  constructor(
    protected override http: HttpService,
    protected override sta: StaInterfaceService
  ) {
    super(http, sta);
  }

  override getPlatform(id: string, url: string, filter: HelgolandParameterFilter): Observable<HelgolandPlatform> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError(() => new Error("Could not create platform")); }
    return this.sta.getLocation(url, id, { $expand: "Things($expand=Locations,Datastreams($filter=properties/hidden ne true;$expand=Thing,Sensor,ObservedProperty))" })
      .pipe(map(loc => this.createExtendedPlatform(loc)));
  }

  override getDataset(internalId: InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset> {
    if (this.filterTimeseriesMatchesNot(filter)) { return throwError(() => new Error("Could not create dataset")); }
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

  override getDatasetData(dataset: HelgolandTimeseries, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
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

  protected override createTsParameter(ds: Datastream, thing: Thing): ParameterConstellation {
    const params = super.createTsParameter(ds, thing);
    // use tags instead of categories
    if (ds.properties?.["tags"] && typeof ds.properties?.["tags"] === "string") {
      const categories: Category[] = ds.properties["tags"].split(",").map((e: string) => ({
        id: e,
        label: e.replace("#", "").charAt(0).toUpperCase() + e.slice(2)
      }))
      params.category = categories;
    } else {
      params.category = [];
    }
    return params;
  }

  override getCategories(url: string, filter: HelgolandParameterFilter): Observable<Category[]> {
    // other option is to use an additional datastream for the categories
    const staFilter = this.createCategoriesFilter(filter);
    staFilter.$select = "properties/tags";
    return this.sta.aggregatePaging(this.sta.getDatastreams(url, staFilter))
      .pipe(map(res => {
        const tags = new Set<string>();
        res.value.forEach(e => {
          if (e.properties?.["tags"] && typeof e.properties?.["tags"] === "string") {
            e.properties["tags"].split(",").forEach(t => {
              tags.add(t);
            })
          }
        })
        return Array.from(tags).map(e => ({
          id: e,
          label: e
        }));
      }))
  }

  protected override createCategoriesFilter(params: HelgolandParameterFilter): StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams> {
    if (params) {
      const filterList: string[] = [];
      if (params.phenomenon) {
        debugger;
        filterList.push(`ObservedProperty/id eq ${params.phenomenon}`);
      }
      if (params.feature) {
        filterList.push(`Thing/Locations/id eq ${params.feature}`);
      }
      if (params.procedure) {
        filterList.push(`Sensor/id eq ${params.procedure}`);
      }
      return this.createFilter(filterList);
    }
    throw new Error("Could not create CategoriesFilter.");
  }

  private createDatasetDataRequest(id: string, url: string, timeFilter: string) {
    return this.sta.aggregatePaging(
      this.sta.getDatastreamObservationsRelation(url, id, { $orderby: "phenomenonTime", $filter: timeFilter, $top: 1000 })
    );
  }

  protected createTimeValueTuple(observations: Observation[]): TimeValueTuple[] {
    return observations
      .filter(obs => obs.phenomenonTime)
      .map(obs => [new Date(obs.phenomenonTime!).getTime(), parseFloat(obs.result as string)] as TimeValueTuple);
  }

  protected override createPhenomenaFilter(params: HelgolandParameterFilter): StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams> {
    if (params) {
      const filterList: string[] = ["Datastreams/properties/hidden ne true"];
      if (params.category) {
        filterList.push(`indexof(Datastreams/properties/tags,'${params.category}') ge 1`);
      }
      if (params.feature) {
        filterList.push(`Datastreams/Thing/Locations/id eq '${params.feature}'`);
      }
      if (params.procedure) {
        filterList.push(`Datastreams/Sensor/id eq ${params.procedure}`);
      }
      return this.createFilter(filterList);
    }
    throw new Error("Could not create PhenomenaFilter.");
  }

  protected override createDatastreamFilter(params: DatasetFilter): StaFilter<DatastreamSelectParams, DatastreamExpandParams> {
    let filter: StaFilter<StaSelectParams, StaExpandParams> = {};
    if (params) {
      const filterList: string[] = ["properties/hidden ne true"];
      if (params.phenomenon) {
        filterList.push(`ObservedProperty/id eq ${params.phenomenon}`);
      }
      if (params.category) {
        filterList.push(`indexof(properties/tags,'${params.category}') ge 1`);
      }
      if (params.procedure) {
        filterList.push(`Sensor/id eq ${params.procedure}`);
      }
      if (params.feature) {
        filterList.push(`Thing/Locations/id eq ${params.feature}`);
      }
      filter = this.createFilter(filterList);
    }
    filter.$expand = "Thing,Thing/Locations,ObservedProperty,Sensor";
    return filter;
  }

  protected override createProceduresFilter(params: HelgolandParameterFilter): StaFilter<SensorSelectParams, SensorExpandParams> {
    if (params) {
      const filterList: string[] = [];
      if (params.category) {
        filterList.push(`indexof(Datastreams/properties/tags,'${params.category}') ge 1`);
      }
      if (params.feature) {
        filterList.push(`Datastreams/Thing/Locations/id eq ${params.feature}`);
      }
      if (params.phenomenon) {
        filterList.push(`Datastreams/ObservedProperty/id eq ${params.phenomenon}`);
      }
      return this.createFilter(filterList);
    }
    return {};
  }

  protected override createFeaturesFilter(params: HelgolandParameterFilter): StaFilter<LocationSelectParams, LocationExpandParams> {
    if (params) {
      const filterList: string[] = [];
      if (params.category) {
        filterList.push(`indexof(Things/Datastreams/properties/tags,'${params.category}') ge 1`);
      }
      if (params.phenomenon) {
        filterList.push(`Things/Datastreams/ObservedProperty/id eq ${params.phenomenon}`);
      }
      if (params.procedure) {
        filterList.push(`Things/Datastreams/Sensor/id eq ${params.procedure}`);
      }
      return this.createFilter(filterList);
    }
    throw new Error("Could not create FeaturesFilter.");
  }

}

export const DatasetStaCustomConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: StaApiCustomConnector,
  multi: true
};