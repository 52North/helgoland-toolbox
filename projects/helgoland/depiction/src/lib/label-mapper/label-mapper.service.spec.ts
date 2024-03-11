import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Settings, SettingsService } from '@helgoland/core';

import { LABEL_MAPPER_HANDLER, LabelMapperService } from './label-mapper.service';
import { VocabNercLabelMapperService } from './vocab-nerc-label-mapper/vocab-nerc-label-mapper.service';

export class MockedSettingsService extends SettingsService<Settings> {
  public override getSettings(): Settings {
    return {
      proxyUrl: 'https://cors-anywhere.herokuapp.com/'
    };
  }
}

describe('LabelMapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        LabelMapperService,
        { provide: SettingsService, useClass: MockedSettingsService },
        {
          provide: LABEL_MAPPER_HANDLER,
          useClass: VocabNercLabelMapperService,
          multi: true
        }
      ]
    });
  });

  it('should be created', inject([LabelMapperService], (service: LabelMapperService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([LabelMapperService], (service: LabelMapperService) => {
    service.getMappedLabel('http://vocab.nerc.ac.uk/collection/P02/current/PCHW/')
      .subscribe(res => {
        console.log(res);
      });
  }));

});
