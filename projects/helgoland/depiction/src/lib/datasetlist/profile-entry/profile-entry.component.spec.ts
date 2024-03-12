import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HelgolandCoreModule, SettingsService } from "@helgoland/core";

import { LabelMapperComponent } from "../../label-mapper/label-mapper.component";
import { LabelMapperService } from "../../label-mapper/label-mapper.service";
import { DatasetApiInterfaceTesting } from "../../../../../../testing/dataset-api-interface.testing";
import { TranslateTestingModule } from "../../../../../../testing/translate.testing.module";
import { ProfileEntryComponent } from "./profile-entry.component";

describe("ProfileEntryComponent", () => {
  let component: ProfileEntryComponent;
  let fixture: ComponentFixture<ProfileEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        ProfileEntryComponent,
        LabelMapperComponent
      ],
      providers: [
        DatasetApiInterfaceTesting,
        LabelMapperService,
        SettingsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEntryComponent);
    component = fixture.componentInstance;
    component.datasetId = "temp__temp";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
