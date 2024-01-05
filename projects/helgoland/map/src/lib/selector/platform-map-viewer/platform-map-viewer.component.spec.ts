import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandMapSelectorModule } from '../module';
import { PlatformMapViewerComponent } from './platform-map-viewer.component';

describe('PlatformMapViewerComponent', () => {
  let component: PlatformMapViewerComponent;
  let fixture: ComponentFixture<PlatformMapViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandMapSelectorModule],
    }).compileComponents();
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
