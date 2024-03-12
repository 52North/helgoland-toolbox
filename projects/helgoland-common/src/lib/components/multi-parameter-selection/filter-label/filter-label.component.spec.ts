import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslateTestingModule } from "./../../../../../../testing/translate.testing.module";
import { FilterLabelComponent } from "./filter-label.component";

describe("FilterLabelComponent", () => {
  let component: FilterLabelComponent;
  let fixture: ComponentFixture<FilterLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        FilterLabelComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
