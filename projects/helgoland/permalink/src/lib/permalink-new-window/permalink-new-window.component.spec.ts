import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PermalinkNewWindowComponent } from './permalink-new-window.component';

describe('PermalinkNewWindowComponent', () => {
  let component: PermalinkNewWindowComponent;
  let fixture: ComponentFixture<PermalinkNewWindowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [PermalinkNewWindowComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkNewWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
