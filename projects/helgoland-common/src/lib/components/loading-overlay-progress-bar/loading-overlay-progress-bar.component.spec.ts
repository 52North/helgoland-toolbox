import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoadingOverlayProgressBarComponent } from './loading-overlay-progress-bar.component';

describe('LoadingOverlayProgressBarComponent', () => {
  let component: LoadingOverlayProgressBarComponent;
  let fixture: ComponentFixture<LoadingOverlayProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        MatProgressBarModule,
        LoadingOverlayProgressBarComponent
    ]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingOverlayProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
