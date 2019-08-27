import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetDownloadComponent } from './dataset-download.component';

describe('DatasetDownloadComponent', () => {
  let component: DatasetDownloadComponent;
  let fixture: ComponentFixture<DatasetDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetDownloadComponent ]
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
