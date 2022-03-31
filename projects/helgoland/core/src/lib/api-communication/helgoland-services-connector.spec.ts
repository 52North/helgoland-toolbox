import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { BasicAuthInterceptorService, BasicAuthServiceMaintainer } from '@helgoland/auth';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from '../core.module';
import { DatasetApiInterface } from '../dataset-api/api-interface';
import { HttpService } from '../dataset-api/http.service';
import { SplittedDataDatasetApiInterface } from '../dataset-api/splitted-data-api-interface.service';
import { Settings } from '../model/settings/settings';
import { SettingsService } from '../settings/settings.service';
import { BasicAuthTestingProviders } from '../../../../../testing/basic-auth.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { HTTP_SERVICE_INTERCEPTORS } from './../dataset-api/http.service';
import { DatasetApiV1ConnectorProvider } from './connectors/dataset-api-v1-connector/dataset-api-v1-connector';
import { DatasetApiV2ConnectorProvider } from './connectors/dataset-api-v2-connector/dataset-api-v2-connector';
import { DatasetApiV3ConnectorProvider } from './connectors/dataset-api-v3-connector/dataset-api-v3-connector';
import { DatasetStaConnectorProvider } from './connectors/sta-api-v1-connector/sta-api-v1-connector';
import { HelgolandServicesConnector } from './helgoland-services-connector';
import { DatasetType } from './model/internal/dataset';
import { HelgolandParameterFilter } from './model/internal/filter';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({});
  }
}

describe('HelgolandservicesConnectorService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule,
      TranslateTestingModule,
    ],
    providers: [
      SettingsServiceTestingProvider,
      {
        provide: SettingsService,
        useClass: ExtendedSettingsService
      },
      BasicAuthTestingProviders,
      {
        provide: HTTP_SERVICE_INTERCEPTORS,
        useClass: BasicAuthInterceptorService,
        multi: true
      },
      HttpService,
      DatasetApiV1ConnectorProvider,
      DatasetApiV2ConnectorProvider,
      DatasetApiV3ConnectorProvider,
      DatasetStaConnectorProvider,
      {
        provide: DatasetApiInterface,
        useClass: SplittedDataDatasetApiInterface
      },
    ]
  }));

  beforeEach(inject([BasicAuthServiceMaintainer], (basicAuthServiceMaintainer: BasicAuthServiceMaintainer) => {
    basicAuthServiceMaintainer.registerService('');
  }));

  it('should be created', () => {
    const service: HelgolandServicesConnector = TestBed.inject(HelgolandServicesConnector);
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    const service: HelgolandServicesConnector = TestBed.inject(HelgolandServicesConnector);
    const urls = [
      // 'https://calgary-aq-sta.sensorup.com/v1.0/',
      // 'https://fluggs.wupperverband.de/sws5/api/',
      // 'http://geo.irceline.be/sos/api/v1/',
    ];
    urls.forEach(url => {
      const filter: HelgolandParameterFilter = { type: DatasetType.Timeseries };

      service.getServices(url, filter).subscribe(res => console.log(res));
      service.getCategories(url, filter).subscribe(res => console.log(res));
      service.getOfferings(url, filter).subscribe(res => console.log(res));
      service.getPhenomena(url, filter).subscribe(res => console.log(res));
      service.getProcedures(url, filter).subscribe(res => console.log(res));
      service.getFeatures(url, filter).subscribe(res => console.log(res));
      service.getPlatforms(url, filter).subscribe(res => console.log(res));

      // service.getDatasets(url, filter).subscribe(datasets => {
      //   console.log(datasets);
      //   if (datasets.length > 0) {
      //     service.getDataset(datasets[0].internalId, filter).subscribe(dataset => {
      //       console.log(dataset);
      //       if (dataset instanceof HelgolandProfile) {
      //         const end = new Date(dataset.lastValue.timestamp);
      //         const start = new Date(dataset.lastValue.timestamp);
      //         start.setDate(start.getDate() - 3);
      //         service.getDatasetData(dataset, new Timespan(start, end)).subscribe(data => console.log(data));
      //       }
      //     });
      //   }
      // });

    });
    expect(service).toBeTruthy();
  });
});
