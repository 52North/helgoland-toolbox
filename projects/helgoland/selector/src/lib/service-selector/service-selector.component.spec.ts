import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule, ParameterFilter } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ServiceSelectorComponent } from './service-selector.component';
import { ServiceSelectorService } from './service-selector.service';

fdescribe('ServiceSelectorComponent', () => {
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
        DatasetApiInterfaceTesting
      ],
      declarations: [ServiceSelectorComponent]
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
      locale: 'de',
      valueTypes: 'quantity'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
