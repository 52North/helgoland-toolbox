import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCache } from '../../base/map-cache.service';
import { ZoomControlComponent } from './zoom.component';

describe('ZoomControlComponent', () => {
  let component: ZoomControlComponent;
  let fixture: ComponentFixture<ZoomControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MapCache
      ],
      declarations: [ZoomControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
