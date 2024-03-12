import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { MinMaxRangeComponent } from "./min-max-range.component";

describe("MinMaxRangeComponent", () => {
  let component: MinMaxRangeComponent;
  let fixture: ComponentFixture<MinMaxRangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MinMaxRangeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinMaxRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
