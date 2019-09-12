import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerAbstractComponent } from './ol-layer-abstract.component';

describe('OlLayerAbstractComponent', () => {
  let component: OlLayerAbstractComponent;
  let fixture: ComponentFixture<OlLayerAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
