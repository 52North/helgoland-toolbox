import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectionViewComponent } from './list-selection-view.component';

describe('ListSelectionViewComponent', () => {
  let component: ListSelectionViewComponent;
  let fixture: ComponentFixture<ListSelectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSelectionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
