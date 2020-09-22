import { TestBed } from '@angular/core/testing';

import { HelgolandCoreModule } from '../../../core.module';
import { StaApiV1Connector } from './sta-api-v1-connector';

describe('StaApiV1Connector', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule
    ]
  }));

  it('should be created', () => {
    const service: StaApiV1Connector = TestBed.inject(StaApiV1Connector);
    expect(service).toBeTruthy();
  });
});
