import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { SettingsServiceTestingProvider } from './../../../../../testing/settings.testing';
import { ServiceFilterSelectorComponent } from './service-filter-selector.component';

describe('ServiceFilterSelectorComponent', () => {
  let component: ServiceFilterSelectorComponent;
  let fixture: ComponentFixture<ServiceFilterSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule
      ],
      providers: [
        SettingsServiceTestingProvider
      ],
      declarations: [ServiceFilterSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
