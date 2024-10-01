import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import {
  DefinedTimespan,
  DefinedTimespanService,
} from '../time/defined-timespan.service';
import { DatasetImplApiInterface } from './dataset-impl-api-interface.service';
import { HttpService } from './http.service';
import { InternalIdHandler } from './internal-id-handler.service';

describe('DatasetImplApiInterface', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateTestingModule],
      providers: [
        DatasetImplApiInterface,
        InternalIdHandler,
        DefinedTimespanService,
        HttpService,
      ],
    });
  });

  it('should be created', inject(
    [DatasetImplApiInterface],
    (service: DatasetImplApiInterface) => {
      expect(service).toBeTruthy();
    },
  ));

  // TODO: use fake service
  // it('should get data for multiple timeseries', (done) => {
  //     inject(
  //         [DatasetImplApiInterface, DefinedTimespanService],
  //         (service: DatasetImplApiInterface, definedTimespanSrvc: DefinedTimespanService) => {
  //             const tsIds = ['1', '2'];
  //             service.getTimeseriesData(
  //                 'http://fluggs.wupperverband.de/sos2/api/v1/',
  //                 tsIds,
  //                 definedTimespanSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY)
  //             ).subscribe(res => {
  //                 expect(res.map(e => e.id)).toEqual(tsIds);
  //                 done();
  //             });
  //         })();
  // });
});
