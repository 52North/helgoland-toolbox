import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformMapViewerComponent } from './platform-map-viewer.component';

describe('PlatformMapViewerComponent', () => {
  let component: PlatformMapViewerComponent;
  let fixture: ComponentFixture<PlatformMapViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformMapViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformMapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
