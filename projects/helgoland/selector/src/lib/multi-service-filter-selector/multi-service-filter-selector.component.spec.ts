import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { MultiServiceFilterSelectorComponent } from './multi-service-filter-selector.component';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';

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
