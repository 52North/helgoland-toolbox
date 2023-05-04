import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DatasetApiV1ConnectorProvider, HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
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
        HelgolandLabelMapperModule,
      ],
      providers: [
        DatasetApiInterfaceTesting,
        SettingsServiceTestingProvider,
        DatasetApiV1ConnectorProvider,
      ],
      declarations: [
        DatasetByStationSelectorComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetByStationSelectorComponent);
    component = fixture.componentInstance;
    component.station = {
      id: 'id',
      datasetIds: [],
      label: 'label'
    };
    component.url = 'url';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
