import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenomenonListSelectorComponent } from './phenomenon-list-selector.component';

describe('PhenomenonListSelectorComponent', () => {
  let component: PhenomenonListSelectorComponent;
  let fixture: ComponentFixture<PhenomenonListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhenomenonListSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenomenonListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
