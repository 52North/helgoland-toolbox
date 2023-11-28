import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelgolandCoreModule } from "@helgoland/core";

import { OlLayerLegendUrlComponent } from "./ol-layer-legend-url.component";

describe("OlLayerLegendUrlComponent", () => {
  let component: OlLayerLegendUrlComponent;
  let fixture: ComponentFixture<OlLayerLegendUrlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCoreModule, OlLayerLegendUrlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerLegendUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
