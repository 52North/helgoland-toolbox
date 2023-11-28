import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ClipboardModule } from "ngx-clipboard";

import { PermalinkToClipboardComponent } from "./permalink-to-clipboard.component";

describe("PermalinkToClipboardComponent", () => {
  let component: PermalinkToClipboardComponent;
  let fixture: ComponentFixture<PermalinkToClipboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ClipboardModule,
        PermalinkToClipboardComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkToClipboardComponent);
    component = fixture.componentInstance;
    component.url = "test";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
