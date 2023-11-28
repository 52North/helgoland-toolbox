/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ListSelectionComponent } from "./list-selection.component";

describe("ListSelectionComponent", () => {
  let component: ListSelectionComponent;
  let fixture: ComponentFixture<ListSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ListSelectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
