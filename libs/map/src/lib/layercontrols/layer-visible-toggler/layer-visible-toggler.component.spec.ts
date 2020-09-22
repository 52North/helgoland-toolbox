import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapCache } from '../../base/map-cache.service';
import { LayerVisibleTogglerComponent } from './layer-visible-toggler.component';

describe('LayerVisibleTogglerComponent', () => {
  let component: LayerVisibleTogglerComponent;
  let fixture: ComponentFixture<LayerVisibleTogglerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LayerVisibleTogglerComponent],
      providers: [MapCache]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerVisibleTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
