import { Observable } from 'rxjs';

import { Station } from '../../model/dataset-api/station';
import { ParameterFilter } from '../../model/internal/http-requests';

export interface IHelgolandServiceConnector {
    getStations(url: string, filter: ParameterFilter): Observable<Station[]>;
    getStation(id: string, url: string, filter: ParameterFilter): Observable<Station>;
}

export interface IHelgolandServiceConnectorHandler extends IHelgolandServiceConnector {
    canHandle(url: string): Observable<boolean>;
}
