import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerTimeSelectorComponent } from './ol-layer-time-selector.component';

describe('OlLayerTimeSelectorComponent', () => {
  let component: OlLayerTimeSelectorComponent;
  let fixture: ComponentFixture<OlLayerTimeSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OlLayerTimeSelectorComponent],
      imports: [FormsModule, HelgolandCoreModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerTimeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
