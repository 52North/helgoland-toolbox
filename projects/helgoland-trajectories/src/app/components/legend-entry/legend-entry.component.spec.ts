import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { HelgolandCoreModule } from "@helgoland/core";
import { ColorPickerModule } from "ngx-color-picker";

import { TranslateTestingModule } from "../../../../../testing/translate.testing.module";
import { LegendEntryComponent } from "./legend-entry.component";

describe("LegendEntryComponent", () => {
  let component: LegendEntryComponent;
  let fixture: ComponentFixture<LegendEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        MatCheckboxModule,
        MatIconModule,
        ColorPickerModule,
        LegendEntryComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
