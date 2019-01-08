import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import {
  MultiServiceFilterSelectorComponent,
} from '../multi-service-filter-selector/multi-service-filter-selector.component';
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
        DatasetApiInterfaceTesting
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

describe('ListSelectorComponent creation', () => {
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
        ListSelectorService,
        DatasetApiInterfaceTesting
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
      { id: '1', url: 'http://localhost:3001/api/', filter: {} }
    ];
    component.filter = {
      valueTypes: 'quantity',
      platformTypes: 'mobile'
    };
    component.parameters = [
      {
        type: 'platform',
        header: 'Platform'
      }, {
        type: 'offering',
        header: 'Offering'
      }, {
        type: 'feature',
        header: 'Pfad'
      }
    ];
    component.ngOnChanges({
      'providerList': new SimpleChange(null, component.providerList, true)
    });
    fixtureInterval = window.setInterval(() => fixture['_isDestroyed'] ? clearInterval(fixtureInterval) : fixture.detectChanges(), 100);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
