import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCachingModule } from '@helgoland/caching';
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

import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import {
  MultiServiceFilterEndpoint,
  MultiServiceFilterSelectorComponent,
} from '../multi-service-filter-selector/multi-service-filter-selector.component';
import { ListSelectorComponent } from './list-selector.component';
import { ListSelectorService } from './list-selector.service';

describe('ListSelectorComponent', () => {
  let component: ListSelectorComponent;
  let fixture: ComponentFixture<ListSelectorComponent>;

  beforeEach(waitForAsync(() => {
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule,
        HelgolandCachingModule
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
      { id: '1', url: 'https://fluggs.wupperverband.de/sws5/api/', filter: {} }
    ];
    component.filter = {
      type: DatasetType.Timeseries,
      platformType: PlatformTypes.mobile
    };
    component.parameters = [
      {
        type: MultiServiceFilterEndpoint.category,
        header: 'Category'
      }, {
        type: MultiServiceFilterEndpoint.feature,
        header: 'Feature'
      }, {
        type: MultiServiceFilterEndpoint.phenomenon,
        header: 'Phenomenon'
      }, {
        type: MultiServiceFilterEndpoint.procedure,
        header: 'Procedure'
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
