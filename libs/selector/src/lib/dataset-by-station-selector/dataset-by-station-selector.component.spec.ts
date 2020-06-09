import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { SettingsServiceTestingProvider } from '../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../testing/translate.testing.module';
import { HelgolandLabelMapperModule } from './../../../../depiction/src/lib/label-mapper/label-mapper.module';
import { DatasetByStationSelectorComponent } from './dataset-by-station-selector.component';

describe('DatasetByStationSelectorComponent', () => {
  let component: DatasetByStationSelectorComponent;
  let fixture: ComponentFixture<DatasetByStationSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateTestingModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule
      ],
      providers: [
        SettingsServiceTestingProvider
      ],
      declarations: [
        DatasetByStationSelectorComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetByStationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
