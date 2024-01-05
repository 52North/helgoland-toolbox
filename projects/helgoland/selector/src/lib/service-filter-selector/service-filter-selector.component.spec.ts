import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ServiceFilterSelectorComponent } from './service-filter-selector.component';

describe('ServiceFilterSelectorComponent', () => {
  let component: ServiceFilterSelectorComponent;
  let fixture: ComponentFixture<ServiceFilterSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule,
        ServiceFilterSelectorComponent,
      ],
      providers: [SettingsServiceTestingProvider],
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
