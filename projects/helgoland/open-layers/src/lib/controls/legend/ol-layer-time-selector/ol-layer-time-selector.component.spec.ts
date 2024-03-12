import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HelgolandCoreModule } from "@helgoland/core";

import { OlLayerTimeSelectorComponent } from "./ol-layer-time-selector.component";
import BaseLayer from "ol/layer/Base";

describe("OlLayerTimeSelectorComponent", () => {
  let component: OlLayerTimeSelectorComponent;
  let fixture: ComponentFixture<OlLayerTimeSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HelgolandCoreModule, OlLayerTimeSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerTimeSelectorComponent);
    component = fixture.componentInstance;
    component.layer = new BaseLayer({});
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
