import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeListSelectorComponent } from './time-list-selector.component';

describe('TimeListSelectorComponent', () => {
  let component: TimeListSelectorComponent;
  let fixture: ComponentFixture<TimeListSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeListSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
