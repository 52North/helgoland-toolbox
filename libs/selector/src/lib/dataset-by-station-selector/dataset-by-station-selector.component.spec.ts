import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { SettingsServiceTestingProvider } from '../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../testing/translate.testing.module';
import { DatasetByStationSelectorComponent } from './dataset-by-station-selector.component';

describe('DatasetByStationSelectorComponent', () => {
  let component: DatasetByStationSelectorComponent;
  let fixture: ComponentFixture<DatasetByStationSelectorComponent>;

  beforeEach(waitForAsync(() => {
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
