import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragOptionsComponent } from './drag-options.component';

describe('DragOptionsComponent', () => {
  let component: DragOptionsComponent;
  let fixture: ComponentFixture<DragOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DragOptionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
