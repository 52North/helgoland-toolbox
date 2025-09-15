import moment from 'moment';

import { Timespan } from '../../model/internal/timeInterval';

export class UrlGenerator {
  createBaseUrl(apiUrl: string, endpoint: string, id?: string): string {
    let requestUrl = apiUrl + endpoint;
    if (id) {
      requestUrl += '/' + id;
    }
    return requestUrl;
  }

  addUrlParams(url: string, params: Map<string, string>): string {
    if (!url.endsWith('?')) {
      url = url + '?';
    }
    params.forEach((value: string, key: string) => {
      url += key + '=' + value + '&';
    });
    return url.slice(0, -1);
  }

  createTimespanRequestParam(timespan: Timespan): string {
    return encodeURIComponent(
      moment(timespan.from).format() + '/' + moment(timespan.to).format(),
    );
  }
}
