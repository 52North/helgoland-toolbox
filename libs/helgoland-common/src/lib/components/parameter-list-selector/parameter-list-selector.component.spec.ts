import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterListSelectorComponent } from './parameter-list-selector.component';

describe('ParameterListSelectorComponent', () => {
  let component: ParameterListSelectorComponent;
  let fixture: ComponentFixture<ParameterListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterListSelectorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
