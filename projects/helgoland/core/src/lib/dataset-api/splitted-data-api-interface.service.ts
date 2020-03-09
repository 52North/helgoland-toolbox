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
            return forkJoin(requests).pipe(map((e) => {
                const mergedResult = e.reduce((previous, current) => {
                    if (previous.values && current.values) {
                        previous.values = previous.values.concat(current.values);
                    }

                    if (previous.valueAfterTimespan && current.valueAfterTimespan) {
                        previous.valueAfterTimespan = current.valueAfterTimespan;
                    }

                    for (const key in previous.referenceValues) {
                        if (previous.referenceValues.hasOwnProperty(key) && current.referenceValues.hasOwnProperty(key)) {
                            const refVal = previous.referenceValues[key];
                            if (refVal instanceof Array) {
                                refVal.concat(current.referenceValues[key]);
                            } else {
                                const currRefValData = (current.referenceValues[key] as never) as Data<T>;
                                const prevRefValData = (refVal as Data<T>);
                                prevRefValData.values = prevRefValData.values.concat(currRefValData.values);
                                if (prevRefValData.valueAfterTimespan && currRefValData.valueAfterTimespan) {
                                    prevRefValData.valueAfterTimespan = currRefValData.valueAfterTimespan;
                                }
                            }
                        }
                    }

                    return previous;
                });
                if (mergedResult.values && mergedResult.values.length > 0) {
                    // cut first
                    const fromIdx = mergedResult.values.findIndex(el => el[0] >= timespan.from);
                    mergedResult.values = mergedResult.values.slice(fromIdx);
                    // cut last
                    const toIdx = mergedResult.values.findIndex(el => el[0] >= timespan.to);
                    if (toIdx >= 0) { mergedResult.values = mergedResult.values.slice(0, toIdx + 1); }
                }
                return mergedResult;
            }));
        } else {
            return super.getTsData<T>(id, apiUrl, timespan, params, options);
        }
    }

    public getData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {},
        options: HttpRequestOptions
    ) {
        const maxTimeExtent = moment.duration(1, 'year').asMilliseconds();
        if ((timespan.to - timespan.from) > maxTimeExtent) {
            const requests: Array<Observable<Data<T>>> = [];
            let start = moment(timespan.from).startOf('year');
            let end = moment(timespan.from).endOf('year');
            while (start.isBefore(moment(timespan.to))) {
                const chunkSpan = new Timespan(start.unix() * 1000, end.unix() * 1000);
                requests.push(super.getData<T>(id, apiUrl, chunkSpan, params, options));
                start = end.add(1, 'millisecond');
                end = moment(start).endOf('year');
            }
            return forkJoin(requests).pipe(map((e) => {
                const mergedResult = e.reduce((previous, current) => {
                    if (previous.values && current.values) {
                        previous.values = previous.values.concat(current.values);
                    }

                    if (previous.valueAfterTimespan && current.valueAfterTimespan) {
                        previous.valueAfterTimespan = current.valueAfterTimespan;
                    }

                    for (const key in previous.referenceValues) {
                        if (previous.referenceValues.hasOwnProperty(key) && current.referenceValues.hasOwnProperty(key)) {
                            const refVal = previous.referenceValues[key];
                            if (refVal instanceof Array) {
                                refVal.concat(current.referenceValues[key]);
                            } else {
                                const currRefValData = (current.referenceValues[key] as never) as Data<T>;
                                const prevRefValData = (refVal as Data<T>);
                                prevRefValData.values = prevRefValData.values.concat(currRefValData.values);
                                if (prevRefValData.valueAfterTimespan && currRefValData.valueAfterTimespan) {
                                    prevRefValData.valueAfterTimespan = currRefValData.valueAfterTimespan;
                                }
                            }
                        }
                    }

                    return previous;
                });
                if (mergedResult.values && mergedResult.values.length > 0) {
                    // cut first
                    const fromIdx = mergedResult.values.findIndex(el => el[0] >= timespan.from);
                    mergedResult.values = mergedResult.values.slice(fromIdx);
                    // cut last
                    const toIdx = mergedResult.values.findIndex(el => el[0] >= timespan.to);
                    if (toIdx >= 0) { mergedResult.values = mergedResult.values.slice(0, toIdx + 1); }
                }
                return mergedResult;
            }));
        } else {
            return super.getData<T>(id, apiUrl, timespan, params, options);
        }
    }

}
