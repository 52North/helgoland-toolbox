import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramViewComponent } from './diagram-view.component';

describe('DiagramViewComponent', () => {
  let component: DiagramViewComponent;
  let fixture: ComponentFixture<DiagramViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
