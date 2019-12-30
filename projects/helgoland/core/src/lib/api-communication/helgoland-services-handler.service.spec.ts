import { TestBed } from '@angular/core/testing';

import { BasicAuthTestingProviders } from '../../../../../testing/basic-auth.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { DatasetApiInterface } from '../dataset-api/api-interface';
import { TranslateTestingModule } from './../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from './../core.module';
import { HttpService } from './../dataset-api/http.service';
import { SplittedDataDatasetApiInterface } from './../dataset-api/splitted-data-api-interface.service';
import { DatasetApiV1Service } from './connectors/dataset-api-v1/dataset-api-v1.service';
import { DatasetApiV3Service } from './connectors/dataset-api-v3/dataset-api-v3.service';
import { StaApiV1Service } from './connectors/sta-api-v1/sta-api-v1.service';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER, HelgolandServicesHandlerService } from './helgoland-services-handler.service';

fdescribe('HelgolandServicesHandlerService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule,
      TranslateTestingModule,
    ],
    providers: [
      SettingsServiceTestingProvider,
      BasicAuthTestingProviders,
      HttpService,
      {
        provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
        useClass: DatasetApiV1Service,
        multi: true
      },
      {
        provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
        useClass: DatasetApiV3Service,
        multi: true
      },
      {
        provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
        useClass: StaApiV1Service,
        multi: true
      },
      {
        provide: DatasetApiInterface,
        useClass: SplittedDataDatasetApiInterface
      },
    ]
  }));

  it('should be created', () => {
    const service: HelgolandServicesHandlerService = TestBed.get(HelgolandServicesHandlerService);
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    const service: HelgolandServicesHandlerService = TestBed.get(HelgolandServicesHandlerService);
    const url = 'https://www.fluggs.de/sos2/api/v1/';
    service.getStations(url).subscribe(res => console.log(res.map(e => e.properties.label)));
    expect(service).toBeTruthy();
  });
});
