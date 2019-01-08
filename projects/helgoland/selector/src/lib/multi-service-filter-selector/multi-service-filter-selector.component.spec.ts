import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { MultiServiceFilterEndpoint, MultiServiceFilterSelectorComponent } from './multi-service-filter-selector.component';

describe('MultiServiceFilterSelectorComponent', () => {
  let component: MultiServiceFilterSelectorComponent;
  let fixture: ComponentFixture<MultiServiceFilterSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
      declarations: [MultiServiceFilterSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiServiceFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('MultiServiceFilterSelectorComponent creation', () => {
  let component: MultiServiceFilterSelectorComponent;
  let fixture: ComponentFixture<MultiServiceFilterSelectorComponent>;

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
        DatasetApiInterfaceTesting
      ],
      declarations: [MultiServiceFilterSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiServiceFilterSelectorComponent);
    component = fixture.componentInstance;
    component.filterList = [
      { url: 'https://www.fluggs.de/sos2/api/v1/' },
      { url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/', filter: { feature: '14' } }
    ];
    component.endpoint = MultiServiceFilterEndpoint.offering;
    component.onItemSelected.subscribe(res => alert(res));
    component.ngOnChanges();
    fixtureInterval = window.setInterval(() => fixture.detectChanges(), 100);
  });

  afterEach(() => {
    clearInterval(fixtureInterval);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
