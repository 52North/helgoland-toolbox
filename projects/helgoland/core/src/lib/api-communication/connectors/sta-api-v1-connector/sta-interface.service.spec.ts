import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { HttpService } from '../../../dataset-api/http.service';
import { InternalIdHandler } from '../../../dataset-api/internal-id-handler.service';
import { SplittedDataDatasetApiInterface } from '../../../dataset-api/splitted-data-api-interface.service';
import { StaInterfaceService } from './sta-interface.service';

const staUrl = 'http://docker.srv.int.52north.org:8081/sta/';
const fluggs = 'https://fluggs.wupperverband.de/sws5/api/';

describe('StaImplInterfaceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateTestingModule],
      providers: [
        HttpService,
        InternalIdHandler,
        SplittedDataDatasetApiInterface,
        StaInterfaceService,
      ],
    }),
  );

  it('should be created', () => {
    const service: StaInterfaceService = TestBed.inject(StaInterfaceService);
    expect(service).toBeTruthy();
  });

  it('should fetch things', () => {
    const read: StaInterfaceService = TestBed.inject(StaInterfaceService);
    expect(read).toBeTruthy();
  });
});
