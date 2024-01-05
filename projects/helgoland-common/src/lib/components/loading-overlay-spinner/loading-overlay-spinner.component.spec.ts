import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingOverlaySpinnerComponent } from './loading-overlay-spinner.component';

describe('LoadingOverlaySpinnerComponent', () => {
  let component: LoadingOverlaySpinnerComponent;
  let fixture: ComponentFixture<LoadingOverlaySpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatProgressSpinnerModule, LoadingOverlaySpinnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingOverlaySpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
