import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DefinedTimespanService } from '@helgoland/core';

import { TimespanButtonComponent } from './timespan-button.component';

describe('TimespanButtonComponent', () => {
  let component: TimespanButtonComponent;
  let fixture: ComponentFixture<TimespanButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TimespanButtonComponent],
      providers: [DefinedTimespanService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimespanButtonComponent);
    component = fixture.componentInstance;
    component.label = 'label';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
