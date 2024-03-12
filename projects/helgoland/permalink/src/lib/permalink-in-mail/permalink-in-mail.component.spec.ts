import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PermalinkInMailComponent } from "./permalink-in-mail.component";

describe("PermalinkInMailComponent", () => {
  let component: PermalinkInMailComponent;
  let fixture: ComponentFixture<PermalinkInMailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PermalinkInMailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkInMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
