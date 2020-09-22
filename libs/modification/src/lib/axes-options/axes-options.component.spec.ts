import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AxesOptionsComponent } from './axes-options.component';

describe('AxesOptionsComponent', () => {
  let component: AxesOptionsComponent;
  let fixture: ComponentFixture<AxesOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AxesOptionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AxesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
