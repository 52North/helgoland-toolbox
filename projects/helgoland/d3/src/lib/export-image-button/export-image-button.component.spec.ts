import { ComponentFixture, inject, TestBed, waitForAsync } from "@angular/core/testing";
import { DatasetOptions, DefinedTimespan, DefinedTimespanService, HelgolandCoreModule } from "@helgoland/core";

import { SettingsServiceTestingProvider } from "../../../../../testing/settings.testing";
import { TranslateTestingModule } from "../../../../../testing/translate.testing.module";
import { HelgolandD3Module } from "./../d3.module";
import { ExportImageButtonComponent } from "./export-image-button.component";

describe("ExportImageButtonComponent", () => {
  let component: ExportImageButtonComponent;
  let fixture: ComponentFixture<ExportImageButtonComponent>;

  const datasetID1 = "http://fluggs.wupperverband.de/sos2/api/v1/__49";
  let definedTimespanSrvc: DefinedTimespanService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        HelgolandD3Module
      ],
      providers: [
        SettingsServiceTestingProvider
      ]
    }).compileComponents();
  }));

  beforeEach(inject([DefinedTimespanService], (service: DefinedTimespanService) => {
    fixture = TestBed.createComponent(ExportImageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    definedTimespanSrvc = service;
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should work", () => {
    const datasetOptions: Map<string, DatasetOptions> = new Map();

    const option1 = new DatasetOptions(datasetID1, "#FF0000");
    option1.lineDashArray = [5, 5];
    option1.separateYAxis = false;
    option1.pointRadius = 4;
    option1.lineWidth = 2;
    option1.visible = true;

    datasetOptions.set(datasetID1, option1);
    component.datasetIds = [datasetID1];
    component.timespan = definedTimespanSrvc.getInterval(DefinedTimespan.TODAY);
    component.datasetOptions = datasetOptions;

    component.title = "Test-Export";
    component.showLegend = true;
    component.showFirstLastDate = true;

    const interval = setInterval(() => {
      if (!fixture["_isDestroyed"]) {
        fixture.detectChanges();
      } else {
        clearInterval(interval);
      }
    }, 1000);

    expect(component).toBeTruthy();
  });
});
