import { TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';
import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { SplittedDataDatasetApiInterface } from '../../../dataset-api/splitted-data-api-interface.service';
import { HelgolandCoreModule } from './../../../core.module';
import { DatasetApiV2Connector } from './dataset-api-v2-connector';

describe('DatasetApiV2Connector', () => {
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
    const service: DatasetApiV2Connector = TestBed.inject(DatasetApiV2Connector);
    expect(service).toBeTruthy();
  });
});
