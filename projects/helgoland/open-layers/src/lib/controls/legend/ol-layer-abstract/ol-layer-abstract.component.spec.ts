import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerAbstractComponent } from './ol-layer-abstract.component';

describe('OlLayerAbstractComponent', () => {
  let component: OlLayerAbstractComponent;
  let fixture: ComponentFixture<OlLayerAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OlLayerAbstractComponent],
      imports: [HelgolandCoreModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerAbstractComponent);
    component = fixture.componentInstance;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
