import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GraphCopyrightComponent } from './d3-graph-copyright.component';

describe('D3GraphCopyrightComponent', () => {
  let component: D3GraphCopyrightComponent;
  let fixture: ComponentFixture<D3GraphCopyrightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GraphCopyrightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GraphCopyrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
