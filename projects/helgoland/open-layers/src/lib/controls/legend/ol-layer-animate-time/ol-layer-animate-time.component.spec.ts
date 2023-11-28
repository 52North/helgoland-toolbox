import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelgolandCoreModule } from "@helgoland/core";
import BaseLayer from "ol/layer/Base";

import { OlLayerAnimateTimeComponent } from "./ol-layer-animate-time.component";

describe("OlLayerAnimateTimeComponent", () => {
  let component: OlLayerAnimateTimeComponent;
  let fixture: ComponentFixture<OlLayerAnimateTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCoreModule, OlLayerAnimateTimeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerAnimateTimeComponent);
    component = fixture.componentInstance;
    component.layer = new BaseLayer({});
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
