import { TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from './../../../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from './../../../core.module';
import { DatasetApiV3Connector } from './dataset-api-v3-connector';

describe('DatasetApiV3Connector', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule,
      TranslateTestingModule
    ]
  }));

  it('should be created', () => {
    const service: DatasetApiV3Connector = TestBed.get(DatasetApiV3Connector);
    expect(service).toBeTruthy();
  });
});
