import { Observable } from 'rxjs';

import { InternalDatasetId } from '../../dataset-api/internal-id-handler.service';
import { Category } from '../../model/dataset-api/category';
import { Offering } from '../../model/dataset-api/offering';
import { Phenomenon } from '../../model/dataset-api/phenomenon';
import { Procedure } from '../../model/dataset-api/procedure';
import { Station } from '../../model/dataset-api/station';
import { Timespan } from '../../model/internal/timeInterval';
import { HelgolandData, HelgolandDataFilter } from '../model/internal/data';
import { DatasetExtras, DatasetFilter, HelgolandDataset } from '../model/internal/dataset';
import { HelgolandParameterFilter } from '../model/internal/filter';
import { Feature } from './../../model/dataset-api/feature';
import { HelgolandService } from './../model/internal/service';

export interface IHelgolandServiceConnector {

    getStations(url: string, filter: HelgolandParameterFilter): Observable<Station[]>;
    getStation(id: string, url: string, filter: HelgolandParameterFilter): Observable<Station>;

    getCategories(url: string, filter: HelgolandParameterFilter): Observable<Category[]>;
    getCategory(id: string, url: string, filter: HelgolandParameterFilter): Observable<Category>;

    getOfferings(url: string, filter: HelgolandParameterFilter): Observable<Offering[]>;
    getOffering(id: string, url: string, filter: HelgolandParameterFilter): Observable<Offering>;

    getPhenomena(url: string, filter: HelgolandParameterFilter): Observable<Phenomenon[]>;
    getPhenomenon(id: string, url: string, filter: HelgolandParameterFilter): Observable<Phenomenon>;

    getProcedures(url: string, filter: HelgolandParameterFilter): Observable<Procedure[]>;
    getProcedure(id: string, url: string, filter: HelgolandParameterFilter): Observable<Procedure>;

    getFeatures(url: string, filter: HelgolandParameterFilter): Observable<Feature[]>;
    getFeature(id: string, url: string, filter: HelgolandParameterFilter): Observable<Feature>;

    getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]>;
    getDataset(internalId: string | InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset>;

    getDatasetExtras(internalId: string | InternalDatasetId): Observable<DatasetExtras>;

    getDatasetData(dataset: HelgolandDataset, timespan: Timespan, params?: HelgolandDataFilter): Observable<HelgolandData>;

    getServices(apiUrl: string, filter: HelgolandParameterFilter): Observable<HelgolandService[]>;
}

export interface IHelgolandServiceConnectorHandler extends IHelgolandServiceConnector {
    canHandle(url: string): Observable<boolean>;
}
