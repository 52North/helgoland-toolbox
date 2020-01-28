import { Timespan } from './../model/internal/timeInterval';
import { inject, TestBed } from '@angular/core/testing';

import { BasicAuthTestingProviders } from '../../../../../testing/basic-auth.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { DatasetApiInterface } from '../dataset-api/api-interface';
import { Timespan } from '../model/internal/timeInterval';
import { TranslateTestingModule } from './../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from './../core.module';
import { HttpService } from './../dataset-api/http.service';
import { SplittedDataDatasetApiInterface } from './../dataset-api/splitted-data-api-interface.service';
import { DatasetApiV1ConnectorProvider } from './connectors/dataset-api-v1/dataset-api-v1.service';
import { DatasetApiV2ConnectorProvider } from './connectors/dataset-api-v2/dataset-api-v2.service';
import { DatasetApiV3ConnectorProvider } from './connectors/dataset-api-v3/dataset-api-v3.service';
import { DatasetStaConnectorProvider } from './connectors/sta-api-v1/sta-api-v1.service';
import { HelgolandServicesHandlerService } from './helgoland-services-handler.service';
import { DatasetType, HelgolandProfile, HelgolandTimeseries, HelgolandTrajectory } from './model/internal/dataset';

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

  it('should be created', () => {
    const service: HelgolandServicesHandlerService = TestBed.get(HelgolandServicesHandlerService);
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    const service: HelgolandServicesHandlerService = TestBed.get(HelgolandServicesHandlerService);
    const urls = [
      // 'https://calgary-aq-sta.sensorup.com/v1.0/',
      // 'https://www.fluggs.de/sos2/api/v1/',
      // 'http://codm.hzg.de/52n-sos-webapp/api/v1/',
      // 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/',
      // 'http://geo.irceline.be/sos/api/v1/',
      // 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/',
      // 'http://monalisasos.eurac.edu/sos/api/v1/',
    ];
    urls.forEach(url => {
      const filter = { type: DatasetType.Profile };

      service.getPlatform('2', url, filter).subscribe(res => console.log(res));
      // service.getServices(url, filter).subscribe(
      //   res => res.forEach(e => console.log(`${e.apiUrl} has ${e.quantities.datasets} datasets`)),
      //   error => console.error(`${error}`)
      // );
      // service.getCategories(url, filter).subscribe(res => console.log(res));
      // service.getCategory('2', url, filter).subscribe(res => console.log(res));
      // service.getOfferings(url, filter).subscribe(res => console.log(res));
      // service.getOffering('1', url, filter).subscribe(res => console.log(res));
      // service.getPhenomena(url, filter).subscribe(res => console.log(res));
      // service.getPhenomenon('3', url, filter).subscribe(res => console.log(res));
      // service.getProcedures(url, filter).subscribe(res => console.log(res));
      // service.getProcedure('1', url, filter).subscribe(res => console.log(res));
      // service.getFeatures(url, filter).subscribe(res => console.log(res));
      // service.getFeature('4', url, filter).subscribe(res => console.log(res));

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
