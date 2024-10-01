import { inject, TestBed } from '@angular/core/testing';

import { LocalStorage } from '../local-storage/local-storage.service';
import { Timespan, BufferedTime } from '../model/internal/timeInterval';
import { Time } from './time.service';

describe('Time', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Time, LocalStorage],
    });
  });

  it('should be created', inject([Time], (service: Time) => {
    expect(service).toBeTruthy();
  }));

  it('should centerTimespan', inject([Time], (service: Time) => {
    const timespan = new Timespan(100000, 200000);
    const centeredTimespan = service.centerTimespan(timespan, new Date(300000));
    const matchedTimespan = new Timespan(250000, 350000);
    expect(centeredTimespan).toEqual(matchedTimespan);
  }));

  it('should stepBack', inject([Time], (service: Time) => {
    const timespan = new Timespan(500000, 600000);
    const backTimespan = service.stepBack(timespan);
    const matchedTimespan = new Timespan(400000, 500000);
    expect(backTimespan).toEqual(matchedTimespan);
  }));

  it('should stepForward', inject([Time], (service: Time) => {
    const timespan = new Timespan(500000, 600000);
    const forwardTimespan = service.stepForward(timespan);
    const matchedTimespan = new Timespan(600000, 700000);
    expect(forwardTimespan).toEqual(matchedTimespan);
  }));

  it('should overlaps', inject([Time], (service: Time) => {
    const timespan = new Timespan(500000, 600000);
    expect(service.overlaps(timespan, 599999, 600002)).toBeTruthy();
    expect(service.overlaps(timespan, 600000, 600002)).toBeTruthy();
    expect(service.overlaps(timespan, 600001, 600002)).toBeFalsy();
  }));

  it('should overlaps', inject([Time], (service: Time) => {
    const timespan = new Timespan(500000, 600000);
    expect(service.createTimespanOfInterval(timespan)).toEqual(timespan);
    const buffered = new BufferedTime(new Date(500000), 100000);
    expect(service.createTimespanOfInterval(buffered)).toEqual(
      new Timespan(450000, 550000),
    );
  }));

  it('should overlaps', inject([Time], (service: Time) => {
    const timespan = new Timespan(500000, 600000);
    expect(service.getBufferedTimespan(timespan, 0.1)).toEqual(
      new Timespan(490000, 610000),
    );
  }));

  it('should save in local storage', inject([Time], (service: Time) => {
    const timespan = new Timespan(500000, 600000);
    service.saveTimespan('testTimespan', timespan);
    expect(service.loadTimespan('testTimespan')).toEqual(timespan);
    expect(service.loadTimespan('nulledTimespan')).toBeNull();
  }));

  it('should create today as timespan', inject([Time], (service: Time) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    const todayTimespan = new Timespan(start.getTime(), end.getTime());
    expect(service.initTimespan()).toEqual(todayTimespan);
  }));
});
