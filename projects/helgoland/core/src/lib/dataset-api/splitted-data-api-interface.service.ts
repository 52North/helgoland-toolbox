import { HttpClient } from '@angular/common/http';
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

    private maxTimeExtent = moment.duration(1, 'year').asMilliseconds();

    constructor(
        protected http: HttpClient,
        protected httpservice: HttpService,
        protected internalDatasetId: InternalIdHandler,
        protected translate: TranslateService
    ) {
        super(http, httpservice, internalDatasetId, translate);
    }

    public getTsData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {},
        options: HttpRequestOptions
    ): Observable<Data<T>> {
        if ((timespan.to - timespan.from) > this.maxTimeExtent) {
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
