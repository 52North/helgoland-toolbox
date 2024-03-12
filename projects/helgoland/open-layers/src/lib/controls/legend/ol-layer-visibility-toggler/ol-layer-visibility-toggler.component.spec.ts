import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { OlLayerVisibilityTogglerComponent } from "./ol-layer-visibility-toggler.component";

describe("OlLayerVisibilityTogglerComponent", () => {
  let component: OlLayerVisibilityTogglerComponent;
  let fixture: ComponentFixture<OlLayerVisibilityTogglerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OlLayerVisibilityTogglerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerVisibilityTogglerComponent);
    component = fixture.componentInstance;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
