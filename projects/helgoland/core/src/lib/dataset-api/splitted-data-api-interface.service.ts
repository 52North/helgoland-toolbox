import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Data } from '../model/dataset-api/data';
import { DataParameterFilter, HttpRequestOptions } from '../model/internal/http-requests';
import { Timespan } from '../model/internal/timeInterval';
import { DatasetImplApiInterface } from './dataset-impl-api-interface.service';
import { HttpService } from './http.service';
import { InternalIdHandler } from './internal-id-handler.service';

@Injectable()
export class SplittedDataDatasetApiInterface extends DatasetImplApiInterface {

    constructor(
        protected httpservice: HttpService,
        protected internalDatasetId: InternalIdHandler,
        protected translate: TranslateService
    ) {
        super(httpservice, internalDatasetId, translate);
    }

    public getTsData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {},
        options: HttpRequestOptions
    ): Observable<Data<T>> {
        const maxTimeExtent = moment.duration(1, 'year').asMilliseconds();
        if ((timespan.to - timespan.from) > maxTimeExtent) {
            const requests: Array<Observable<Data<T>>> = [];
            let start = moment(timespan.from).startOf('year');
            let end = moment(timespan.from).endOf('year');
            while (start.isBefore(moment(timespan.to))) {
                const chunkSpan = new Timespan(start.unix() * 1000, end.unix() * 1000);
                requests.push(super.getTsData<T>(id, apiUrl, chunkSpan, params, options));
                start = end.add(1, 'millisecond');
                end = moment(start).endOf('year');
            }
            return forkJoin(requests).pipe(map((entry) => {
                const idxFrom = entry[0].values.findIndex(el => el[0] >= timespan.from);
                let idxTo = entry[entry.length - 1].values.findIndex(el => el[0] >= timespan.to);
                entry[0].values = entry[0].values.slice(idxFrom); // slice array including timespan.from
                idxTo = entry[entry.length - 1].values[idxTo][0] > timespan.to ? idxTo - 1 : idxTo;
                entry[entry.length - 1].values = entry[entry.length - 1].values.slice(0, idxTo + 1); // slice array including timespan.to, but excluding bigger timespan
                return entry.reduce((previous, current) => {
                    const next: Data<T> = {
                        referenceValues: {},
                        values: previous.values.concat(current.values)
                    };
                    for (const key in previous.referenceValues) {
                        if (previous.referenceValues.hasOwnProperty(key)) {
                            next.referenceValues[key] = previous.referenceValues[key].concat(current.referenceValues[key]);
                        }
                    }
                    return next;
                });
            }));
        } else {
            return super.getTsData<T>(id, apiUrl, timespan, params, options);
        }
    }

}
