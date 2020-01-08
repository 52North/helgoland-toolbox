import { Observable } from 'rxjs';

import { InternalDatasetId } from '../../dataset-api/internal-id-handler.service';
import { Category } from '../../model/dataset-api/category';
import { Offering } from '../../model/dataset-api/offering';
import { Phenomenon } from '../../model/dataset-api/phenomenon';
import { Procedure } from '../../model/dataset-api/procedure';
import { Service } from '../../model/dataset-api/service';
import { Station } from '../../model/dataset-api/station';
import { ParameterFilter } from '../../model/internal/http-requests';
import { Timespan } from '../../model/internal/timeInterval';
import { HelgolandData, HelgolandDataFilter } from '../model/internal/data';
import { DatasetFilter, HelgolandDataset } from '../model/internal/dataset';
import { Feature } from './../../model/dataset-api/feature';

export interface IHelgolandServiceConnector {
    getStations(url: string, filter: ParameterFilter): Observable<Station[]>;
    getStation(id: string, url: string, filter: ParameterFilter): Observable<Station>;

    getCategories(url: string, filter: ParameterFilter): Observable<Category[]>;
    getCategory(id: string, url: string, filter: ParameterFilter): Observable<Category>;

    getOfferings(url: string, filter: ParameterFilter): Observable<Offering[]>;
    getOffering(id: string, url: string, filter: ParameterFilter): Observable<Offering>;

    getPhenomena(url: string, filter: ParameterFilter): Observable<Phenomenon[]>;
    getPhenomenon(id: string, url: string, filter: ParameterFilter): Observable<Phenomenon>;

    getProcedures(url: string, filter: ParameterFilter): Observable<Procedure[]>;
    getProcedure(id: string, url: string, filter: ParameterFilter): Observable<Procedure>;

    getFeatures(url: string, filter: ParameterFilter): Observable<Feature[]>;
    getFeature(id: string, url: string, filter: ParameterFilter): Observable<Feature>;

    getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]>;
    getDataset(internalId: string | InternalDatasetId): Observable<HelgolandDataset>;

    getDatasetData(dataset: HelgolandDataset, timespan: Timespan, params?: HelgolandDataFilter): Observable<HelgolandData>;

    getServices(apiUrl: string, filter: ParameterFilter): Observable<Service[]>;
}

export interface IHelgolandServiceConnectorHandler extends IHelgolandServiceConnector {
    canHandle(url: string): Observable<boolean>;
}
