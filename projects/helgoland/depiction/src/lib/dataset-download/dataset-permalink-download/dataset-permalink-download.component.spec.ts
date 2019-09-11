import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetPermalinkDownloadComponent } from './dataset-permalink-download.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { HelgolandCoreModule } from '@helgoland/core';

describe('DatasetDownloadComponent', () => {
  let component: DatasetPermalinkDownloadComponent;
  let fixture: ComponentFixture<DatasetPermalinkDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetPermalinkDownloadComponent ],
      imports: [
        HelgolandCoreModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    })
    .compileComponents();
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
