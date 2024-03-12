import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Layer } from "leaflet";

import { MapCache } from "../../base/map-cache.service";
import { LayerVisibleTogglerComponent } from "./layer-visible-toggler.component";

describe("LayerVisibleTogglerComponent", () => {
  let component: LayerVisibleTogglerComponent;
  let fixture: ComponentFixture<LayerVisibleTogglerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LayerVisibleTogglerComponent],
      providers: [MapCache]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerVisibleTogglerComponent);
    component = fixture.componentInstance;
    component.layeroptions = {
      label: "test",
      layer: new Layer(),
      visible: false
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
