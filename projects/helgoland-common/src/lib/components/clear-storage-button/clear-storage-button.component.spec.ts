import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HelgolandCoreModule } from "@helgoland/core";

import { TranslateTestingModule } from "../../../../../testing/translate.testing.module";
import { ClearStorageButtonComponent } from "./clear-storage-button.component";

describe("ClearStorageButtonComponent", () => {
  let component: ClearStorageButtonComponent;
  let fixture: ComponentFixture<ClearStorageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        ClearStorageButtonComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearStorageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
