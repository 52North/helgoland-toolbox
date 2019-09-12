import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerTimeSelectorComponent } from './ol-layer-time-selector.component';

describe('OlLayerTimeSelectorComponent', () => {
  let component: OlLayerTimeSelectorComponent;
  let fixture: ComponentFixture<OlLayerTimeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerTimeSelectorComponent ]
    })
    .compileComponents();
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
