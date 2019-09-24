import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerVisibilityTogglerComponent } from './ol-layer-visibility-toggler.component';

describe('OlLayerVisibilityTogglerComponent', () => {
  let component: OlLayerVisibilityTogglerComponent;
  let fixture: ComponentFixture<OlLayerVisibilityTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerVisibilityTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerVisibilityTogglerComponent);
    component = fixture.componentInstance;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
