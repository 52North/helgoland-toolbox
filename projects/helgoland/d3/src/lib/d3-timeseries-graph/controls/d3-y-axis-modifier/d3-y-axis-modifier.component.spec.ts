import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3YAxisModifierComponent } from './d3-y-axis-modifier.component';

describe('D3YAxisModifierComponent', () => {
  let component: D3YAxisModifierComponent;
  let fixture: ComponentFixture<D3YAxisModifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3YAxisModifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3YAxisModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
