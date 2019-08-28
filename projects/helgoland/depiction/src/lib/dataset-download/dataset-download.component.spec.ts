import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetDownloadComponent } from './dataset-download.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { HelgolandCoreModule } from '@helgoland/core';

describe('DatasetDownloadComponent', () => {
  let component: DatasetDownloadComponent;
  let fixture: ComponentFixture<DatasetDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetDownloadComponent ],
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
    fixture = TestBed.createComponent(DatasetDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
