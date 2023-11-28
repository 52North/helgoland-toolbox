import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslateTestingModule } from "../../../../../testing/translate.testing.module";
import { TrajectoryLabelComponent } from "./trajectory-label.component";

describe("TrajectoryLabelComponent", () => {
  let component: TrajectoryLabelComponent;
  let fixture: ComponentFixture<TrajectoryLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        TrajectoryLabelComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoryLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
