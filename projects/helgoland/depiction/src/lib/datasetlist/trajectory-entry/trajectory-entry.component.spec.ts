import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelgolandCoreModule } from "@helgoland/core";

import { DatasetApiInterfaceTesting } from "../../../../../../testing/dataset-api-interface.testing";
import { TranslateTestingModule } from "../../../../../../testing/translate.testing.module";
import { SettingsServiceTestingProvider } from "../../../../../../testing/settings.testing";
import { TrajectoryEntryComponent } from "./trajectory-entry.component";

describe("TrajectoryEntryComponent", () => {
  let component: TrajectoryEntryComponent;
  let fixture: ComponentFixture<TrajectoryEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        TrajectoryEntryComponent
      ],
      providers: [
        DatasetApiInterfaceTesting,
        SettingsServiceTestingProvider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoryEntryComponent);
    component = fixture.componentInstance;
    component.datasetId = "temp__temp";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
