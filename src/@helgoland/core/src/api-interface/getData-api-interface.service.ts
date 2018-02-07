import 'rxjs/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '../model/api/data';
import { DataParameterFilter } from '../model/api/parameterFilter';
import { Timespan } from '../model/internal/timeInterval';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { InternalIdHandler } from './internal-id-handler.service';
import { SimpleApiInterface } from './simple-api-interface.service';

@Injectable()
export class GetDataApiInterface extends SimpleApiInterface {

    private maxTimeExtent = moment.duration(1, 'year').asMilliseconds();

    constructor(
        protected http: HttpClient,
        protected internalDatasetId: InternalIdHandler,
        protected translate: TranslateService
    ) {
        super(http, internalDatasetId, translate);
    }

    public getTsData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {}
    ): Observable<Data<T>> {
        if ((timespan.to - timespan.from) > this.maxTimeExtent) {
            const requests: Array<Observable<Data<T>>> = [];
            let start = moment(timespan.from).startOf('year');
            let end = moment(timespan.from).endOf('year');
            while (start.isBefore(moment(timespan.to))) {
                const chunkSpan = new Timespan(start.unix() * 1000, end.unix() * 1000);
                requests.push(super.getTsData<T>(id, apiUrl, chunkSpan, params));
                start = end.add(1, 'millisecond');
                end = moment(start).endOf('year');
            }
            return Observable.forkJoin(requests).map((entry) => {
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
            });
        } else {
            return super.getTsData<T>(id, apiUrl, timespan, params);
        }
    }

}
