import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ExportImageButtonComponent } from './export-image-button.component';

describe('ExportImageButtonComponent', () => {
  let component: ExportImageButtonComponent;
  let fixture: ComponentFixture<ExportImageButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
      declarations: [ExportImageButtonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportImageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
