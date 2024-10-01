import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapCache } from '../../base/map-cache.service';
import { LocateControlComponent } from './locate.component';
import { LocateService } from './locate.service';

describe('LocateControlComponent', () => {
  let component: LocateControlComponent;
  let fixture: ComponentFixture<LocateControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LocateControlComponent],
      providers: [LocateService, MapCache],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocateControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
