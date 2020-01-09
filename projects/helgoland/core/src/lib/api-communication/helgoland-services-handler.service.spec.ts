import { TestBed } from '@angular/core/testing';

import { BasicAuthTestingProviders } from '../../../../../testing/basic-auth.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { DatasetApiInterface } from '../dataset-api/api-interface';
import { Timespan } from '../model/internal/timeInterval';
import { TranslateTestingModule } from './../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from './../core.module';
import { HttpService } from './../dataset-api/http.service';
import { SplittedDataDatasetApiInterface } from './../dataset-api/splitted-data-api-interface.service';
import { DatasetApiV1ConnectorProvider } from './connectors/dataset-api-v1/dataset-api-v1.service';
import { DatasetApiV3ConnectorProvider } from './connectors/dataset-api-v3/dataset-api-v3.service';
import { DatasetStaConnectorProvider } from './connectors/sta-api-v1/sta-api-v1.service';
import { HelgolandServicesHandlerService } from './helgoland-services-handler.service';
import { HelgolandTimeseries } from './model/internal/dataset';

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
    ];
    urls.forEach(url => {
      // service.getStations(url).subscribe(res => console.log(res.map(e => `Id: ${e.id}, Label: ${e.label}`)));
      // service.getStation('42', url).subscribe(res => console.log(res));
      // service.getServices(url).subscribe(
      //   res => res.forEach(e => console.log(e)),
      //   error => console.error(`${error}`)
      // );
      // service.getCategories(url).subscribe(res => console.log(res));
      // service.getCategory('1', url).subscribe(res => console.log(res));
      // service.getOfferings(url).subscribe(res => console.log(res));
      // service.getOffering('1', url).subscribe(res => console.log(res));
      // service.getPhenomena(url, { category: '1', offering: '1', phenomenon: '1', procedure: '1', feature: '4' }).subscribe(res => console.log(res));
      // service.getPhenomenon('3', url).subscribe(res => console.log(res));
      // service.getProcedures(url).subscribe(res => console.log(res));
      // service.getProcedure('1', url).subscribe(res => console.log(res));
      // service.getFeatures(url).subscribe(res => console.log(res));
      // service.getFeature('4', url).subscribe(res => console.log(res));
      service.getDatasets(url, { lang: 'de' }).subscribe(datasets => {
        console.log(datasets);
        if (datasets.length > 0) {
          service.getDataset(datasets[0].internalId, { lang: 'de' }).subscribe(dataset => {
            console.log(dataset);
            if (dataset instanceof HelgolandTimeseries) {
              const end = new Date(dataset.lastValue.timestamp);
              const start = new Date(dataset.lastValue.timestamp);
              start.setDate(start.getDate() - 3);
              service.getDatasetData(dataset, new Timespan(start, end)).subscribe(data => console.log(data));
            }
          });
        }
      });
    });
    expect(service).toBeTruthy();
  });
});
