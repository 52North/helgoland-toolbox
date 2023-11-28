import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelgolandCoreModule } from "@helgoland/core";
import { HelgolandLabelMapperModule } from "@helgoland/depiction";

import { SettingsServiceTestingProvider } from "../../../../../testing/settings.testing";
import { TranslateTestingModule } from "../../../../../testing/translate.testing.module";
import { MultiServiceFilterEndpoint, MultiServiceFilterSelectorComponent } from "./multi-service-filter-selector.component";

describe("MultiServiceFilterSelectorComponent", () => {
  let component: MultiServiceFilterSelectorComponent;
  let fixture: ComponentFixture<MultiServiceFilterSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule,
        MultiServiceFilterSelectorComponent
      ],
      providers: [
        SettingsServiceTestingProvider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiServiceFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

describe("MultiServiceFilterSelectorComponent creation", () => {
  let component: MultiServiceFilterSelectorComponent;
  let fixture: ComponentFixture<MultiServiceFilterSelectorComponent>;

  let fixtureInterval: number;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        TranslateTestingModule,
        MultiServiceFilterSelectorComponent
      ],
      providers: [
        SettingsServiceTestingProvider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiServiceFilterSelectorComponent);
    component = fixture.componentInstance;
    component.filterList = [
      { url: "https://fluggs.wupperverband.de/sws5/api/" },
      { url: "http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/", filter: { feature: "14" } }
    ];
    component.endpoint = MultiServiceFilterEndpoint.offering;
    component.onItemSelected.subscribe(res => alert(res));
    component.ngOnChanges({});
    fixtureInterval = window.setInterval(() => fixture["_isDestroyed"] ? clearInterval(fixtureInterval) : fixture.detectChanges(), 100);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
