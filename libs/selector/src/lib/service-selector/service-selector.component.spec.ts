import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetType, HelgolandCoreModule } from '@helgoland/core';

import { SettingsServiceTestingProvider } from '../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../testing/translate.testing.module';
import { ServiceSelectorComponent } from './service-selector.component';
import { ServiceSelectorService } from './service-selector.service';

describe('ServiceSelectorComponent', () => {
  let component: ServiceSelectorComponent;
  let fixture: ComponentFixture<ServiceSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        ServiceSelectorService,
        SettingsServiceTestingProvider,
      ],
      declarations: [
        ServiceSelectorComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSelectorComponent);
    component = fixture.componentInstance;
    // component.datasetApiList = [{
    //   name: 'name',
    //   url: 'url-to-test'
    // }];
    component.filter = {
      lang: 'de',
      type: DatasetType.Timeseries
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
