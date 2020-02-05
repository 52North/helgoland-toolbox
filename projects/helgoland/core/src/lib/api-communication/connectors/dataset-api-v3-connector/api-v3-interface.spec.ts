import { TestBed } from '@angular/core/testing';
import { BasicAuthInterceptorService } from '@helgoland/auth';
import { TranslateTestingModule } from 'projects/testing/translate.testing.module';

import { SettingsServiceTestingProvider } from '../../../../../../../testing/settings.testing';
import { HTTP_SERVICE_INTERCEPTORS } from '../../../dataset-api/http.service';
import { BasicAuthTestingProviders } from './../../../../../../../testing/basic-auth.testing';
import { HelgolandCoreModule } from './../../../core.module';
import { ApiV3InterfaceService } from './api-v3-interface';

describe('ApiV3InterfaceService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule,
      TranslateTestingModule
    ],
    providers: [
      SettingsServiceTestingProvider,
      BasicAuthTestingProviders,
      {
        provide: HTTP_SERVICE_INTERCEPTORS,
        useClass: BasicAuthInterceptorService,
        multi: true
      }
    ]
  }));

  it('should be created', () => {
    const service: ApiV3InterfaceService = TestBed.get(ApiV3InterfaceService);
    // const timespan: Timespan = new Timespan(new Date(2010, 1, 1), new Date(2020, 1, 1));
    // service.getSamplings('', {
    //   timespan: encodeURI(moment(timespan.from).format() + '/' + moment(timespan.to).format()),
    // }).subscribe(samples => {
    //   console.log(samples);
    // });
    expect(service).toBeTruthy();
  });
});
