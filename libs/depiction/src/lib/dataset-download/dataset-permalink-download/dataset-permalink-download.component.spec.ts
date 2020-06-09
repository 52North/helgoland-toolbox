import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetPermalinkDownloadComponent } from './dataset-permalink-download.component';

import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';

describe('DatasetPermalinkDownloadComponent', () => {
  let component: DatasetPermalinkDownloadComponent;
  let fixture: ComponentFixture<DatasetPermalinkDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetPermalinkDownloadComponent],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPermalinkDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
