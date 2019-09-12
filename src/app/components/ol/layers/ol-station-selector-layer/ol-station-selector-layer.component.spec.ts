import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlStationSelectorLayerComponent } from './ol-station-selector-layer.component';

describe('OlStationSelectorLayerComponent', () => {
  let component: OlStationSelectorLayerComponent;
  let fixture: ComponentFixture<OlStationSelectorLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlStationSelectorLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlStationSelectorLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
