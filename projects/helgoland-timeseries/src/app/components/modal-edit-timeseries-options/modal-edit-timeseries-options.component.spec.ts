import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { ColorPickerModule } from "ngx-color-picker";

import { TranslateTestingModule } from "../../../../../testing/translate.testing.module";
import { ModalEditTimeseriesOptionsComponent } from "./modal-edit-timeseries-options.component";

describe("ModalEditTimeseriesOptionsComponent", () => {
  let component: ModalEditTimeseriesOptionsComponent;
  let fixture: ComponentFixture<ModalEditTimeseriesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        HttpClientModule,
        MatSliderModule,
        MatSlideToggleModule,
        FormsModule,
        ColorPickerModule,
        ModalEditTimeseriesOptionsComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditTimeseriesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
