import { TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
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
    const service: DatasetApiV3Connector = TestBed.inject(DatasetApiV3Connector);
    expect(service).toBeTruthy();
    // const url = '';
    // service.getDatasets(url, {}).subscribe(ds => ds.forEach(d => service.getDataset({ url, id: d.id }, {}).subscribe(dataset => console.log(dataset))));
    // service.getDataset({ url, id: '18' }, {}).subscribe(ds => console.log(ds));
  });
});
