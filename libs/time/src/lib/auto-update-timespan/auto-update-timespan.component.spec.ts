import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule, Timespan } from '@helgoland/core';

import { AutoUpdateTimespanComponent } from './auto-update-timespan.component';

describe('AutoUpdateTimespanComponent', () => {
  let component: AutoUpdateTimespanComponent;
  let fixture: ComponentFixture<AutoUpdateTimespanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule
      ],
      declarations: [AutoUpdateTimespanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoUpdateTimespanComponent);
    component = fixture.componentInstance;
    component.currentTimespan = new Timespan(new Date().getTime() - 10000000, new Date().getTime());
    component.timeInterval = 100000;
    component.refreshInterval = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not update from beginning', () => {
    expect(component.toggleAutoUpdate).toBe(false);
  });

  it('should toggle auto update', () => {
    // off before toggle
    expect(component.toggleAutoUpdate).toBe(false);
    component.toggleUpdateTimeinterval();
    // on after toggle
    expect(component.toggleAutoUpdate).toBe(true);
    component.toggleUpdateTimeinterval();
    // off after toggle again
    expect(component.toggleAutoUpdate).toBe(false);
  });

  // it('should update timespan', fakeAsync(() => {
  //   component.timeInterval = 123456789;
  //   component.refreshInterval = 5;
  //   const oldTimespan = component.currentTimespan;
  //   component.updateTimespan();
  //   setTimeout(() => {
  //     fixture.detectChanges();
  //   }, 5000);
  //   tick(5000);
  //   expect(component.currentTimespan.from).toBeGreaterThan(oldTimespan.from);
  //   expect(component.currentTimespan.to).toBeGreaterThan(oldTimespan.to);
  // }));

});
