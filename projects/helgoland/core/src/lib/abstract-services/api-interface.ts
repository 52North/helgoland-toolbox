import moment from 'moment';

import { Timespan } from '../model/internal/timeInterval';
import { HttpHeaders } from '@angular/common/http';

export abstract class ApiInterface {

    protected createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
        // TODO Check whether apiUrl ends with slash
        let requestUrl = apiUrl + endpoint;
        if (id) { requestUrl += '/' + id; }
        return requestUrl;
    }

    protected createRequestTimespan(timespan: Timespan): string {
        return encodeURI(moment(timespan.from).format() + '/' + moment(timespan.to).format());
    }

    protected createBasicAuthHeader(token?: string): HttpHeaders {
        const headers = new HttpHeaders();
        if (token) { return headers.set('Authorization', token); }
        return headers;
    }

}
