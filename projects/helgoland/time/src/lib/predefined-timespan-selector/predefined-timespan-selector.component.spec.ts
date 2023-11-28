import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DefinedTimespanService, SettingsService } from "@helgoland/core";

import { PredefinedTimespanSelectorComponent } from "./predefined-timespan-selector.component";

describe("PredefinedTimespanSelectorComponent", () => {
  let component: PredefinedTimespanSelectorComponent;
  let fixture: ComponentFixture<PredefinedTimespanSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PredefinedTimespanSelectorComponent],
      providers: [
        SettingsService,
        DefinedTimespanService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedTimespanSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
