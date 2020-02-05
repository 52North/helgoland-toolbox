import { TestBed } from '@angular/core/testing';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { SplittedDataDatasetApiInterface } from '../../../dataset-api/splitted-data-api-interface.service';
import { TranslateTestingModule } from './../../../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from './../../../core.module';
import { DatasetApiV1Connector } from './dataset-api-v1-connector';

describe('DatasetApiV1Connector', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule,
      TranslateTestingModule
    ],
    providers: [
      {
        provide: DatasetApiInterface,
        useClass: SplittedDataDatasetApiInterface
      }
    ]
  }));

  it('should be created', () => {
    const service: DatasetApiV1Connector = TestBed.get(DatasetApiV1Connector);
    expect(service).toBeTruthy();
  });
});
