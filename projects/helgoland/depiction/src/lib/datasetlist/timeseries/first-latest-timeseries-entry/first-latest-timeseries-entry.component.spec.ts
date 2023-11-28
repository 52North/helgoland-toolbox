import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelgolandCoreModule } from "@helgoland/core";

import { SettingsServiceTestingProvider } from "../../../../../../../testing/settings.testing";
import { TranslateTestingModule } from "../../../../../../../testing/translate.testing.module";
import { FirstLatestTimeseriesEntryComponent } from "./first-latest-timeseries-entry.component";

describe("FirstLatestTimeseriesEntryComponent", () => {
  let component: FirstLatestTimeseriesEntryComponent;
  let fixture: ComponentFixture<FirstLatestTimeseriesEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        FirstLatestTimeseriesEntryComponent
      ],
      providers: [
        SettingsServiceTestingProvider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstLatestTimeseriesEntryComponent);
    component = fixture.componentInstance;
    component.datasetId = "temp__temp";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
