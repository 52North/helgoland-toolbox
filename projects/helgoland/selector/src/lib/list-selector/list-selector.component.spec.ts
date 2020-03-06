import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  DatasetType,
  HelgolandCoreModule,
  PlatformTypes,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import {
  MultiServiceFilterSelectorComponent,
} from '../multi-service-filter-selector/multi-service-filter-selector.component';
import { SettingsServiceTestingProvider } from './../../../../../testing/settings.testing';
import { ListSelectorComponent } from './list-selector.component';
import { ListSelectorService } from './list-selector.service';

describe('ListSelectorComponent', () => {
  let component: ListSelectorComponent;
  let fixture: ComponentFixture<ListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule
      ],
      providers: [
        ListSelectorService,
        SettingsServiceTestingProvider
      ],
      declarations: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('ListSelectorComponent', () => {
  let component: ListSelectorComponent;
  let fixture: ComponentFixture<ListSelectorComponent>;
  let fixtureInterval: number;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule
      ],
      providers: [
        {
          provide: DatasetApiInterface,
          useClass: SplittedDataDatasetApiInterface
        },
        DatasetApiV1ConnectorProvider,
        DatasetApiV2ConnectorProvider,
        DatasetApiV3ConnectorProvider,
        DatasetStaConnectorProvider,
        ListSelectorService,
        SettingsServiceTestingProvider
      ],
      declarations: [
        ListSelectorComponent,
        MultiServiceFilterSelectorComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelectorComponent);
    component = fixture.componentInstance;
    component.selectorId = 'test-id';
    component.providerList = [
      { id: '1', url: 'https://www.fluggs.de/sos2/api/v1/', filter: {} }
    ];
    component.filter = {
      type: DatasetType.Timeseries,
      platformType: PlatformTypes.mobile
    };
    component.parameters = [
      {
        type: 'category',
        header: 'Category'
      }, {
        type: 'offering',
        header: 'Offering'
      }, {
        type: 'phenomenon',
        header: 'Phenomenon'
      }
    ];
    component.ngOnChanges({
      'providerList': new SimpleChange(null, component.providerList, true)
    });
    component.onDatasetSelection.subscribe(datasets => console.log(datasets));
    fixtureInterval = window.setInterval(() => fixture['_isDestroyed'] ? clearInterval(fixtureInterval) : fixture.detectChanges(), 100);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
