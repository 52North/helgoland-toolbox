import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetExportComponent } from './dataset-export.component';

import { HelgolandCoreModule } from '@helgoland/core';
import { DatasetApiInterfaceTesting } from '../../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';


describe('DatasetExportComponent', () => {
  let component: DatasetExportComponent;
  let fixture: ComponentFixture<DatasetExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
      declarations: [DatasetExportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
