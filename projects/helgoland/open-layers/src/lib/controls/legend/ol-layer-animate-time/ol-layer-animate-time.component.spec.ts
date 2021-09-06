import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerAnimateTimeComponent } from './ol-layer-animate-time.component';

describe('OlLayerAnimateTimeComponent', () => {
  let component: OlLayerAnimateTimeComponent;
  let fixture: ComponentFixture<OlLayerAnimateTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OlLayerAnimateTimeComponent],
      imports: [HelgolandCoreModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerAnimateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
