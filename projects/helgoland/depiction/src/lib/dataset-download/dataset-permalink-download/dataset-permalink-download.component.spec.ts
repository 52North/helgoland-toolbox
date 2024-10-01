import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { SettingsServiceTestingProvider } from '../../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { DatasetPermalinkDownloadComponent } from './dataset-permalink-download.component';

describe('DatasetPermalinkDownloadComponent', () => {
  let component: DatasetPermalinkDownloadComponent;
  let fixture: ComponentFixture<DatasetPermalinkDownloadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        DatasetPermalinkDownloadComponent,
      ],
      providers: [SettingsServiceTestingProvider],
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
