import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlComponent } from './ol.component';

describe('OlComponent', () => {
  let component: OlComponent;
  let fixture: ComponentFixture<OlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
