import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelgolandCoreModule } from "@helgoland/core";

import { TranslateTestingModule } from "../../../../../../testing/translate.testing.module";
import { DatasetExportComponent } from "./dataset-export.component";
import { SettingsServiceTestingProvider } from "../../../../../../testing/settings.testing";

describe("DatasetExportComponent", () => {
  let component: DatasetExportComponent;
  let fixture: ComponentFixture<DatasetExportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        DatasetExportComponent
      ],
      providers: [
        SettingsServiceTestingProvider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
