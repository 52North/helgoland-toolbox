import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerAbstractComponent } from './ol-layer-abstract.component';

describe('OlLayerAbstractComponent', () => {
  let component: OlLayerAbstractComponent;
  let fixture: ComponentFixture<OlLayerAbstractComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [HelgolandCoreModule, OlLayerAbstractComponent]
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
