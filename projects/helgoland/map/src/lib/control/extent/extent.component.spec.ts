import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCache } from '../../base/map-cache.service';
import { ExtentControlComponent } from './extent.component';

describe('ExtentControlComponent', () => {
  let component: ExtentControlComponent;
  let fixture: ComponentFixture<ExtentControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MapCache
      ],
      declarations: [ExtentControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtentControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
