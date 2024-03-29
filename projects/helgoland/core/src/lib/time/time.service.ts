import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import moment, { duration, MomentInputObject } from 'moment';

import { LocalStorage } from '../local-storage/local-storage.service';
import {
  BufferedTime,
  TimeInterval,
  Timespan,
} from '../model/internal/timeInterval';

@Injectable()
export class Time {
  constructor(protected localStorage: LocalStorage) {}

  public centerTimespan(timespan: Timespan, date: Date): Timespan {
    const halfduration = this.getDuration(timespan).asMilliseconds() / 2;
    const from = moment(date).subtract(halfduration).unix() * 1000;
    const to = moment(date).add(halfduration).unix() * 1000;
    return new Timespan(from, to);
  }

  public centerTimespanWithDuration(
    timespan: Timespan,
    d: moment.Duration,
  ): Timespan {
    const half = d.asMilliseconds() / 2;
    const center = this.getCenterOfTimespan(timespan);
    return new Timespan(center - half, center + half);
  }

  public getCenterOfTimespan(timespan: Timespan): number {
    return timespan.from + (timespan.to - timespan.from) / 2;
  }

  public createByDurationWithEnd(
    d: moment.Duration,
    end: number | Date,
    endOf?: moment.unitOfTime.StartOf,
  ): Timespan {
    const mEnd = moment(end);
    if (endOf) {
      mEnd.endOf(endOf);
    }
    const mStart = moment(mEnd).subtract(d);
    return new Timespan(mStart.toDate(), mEnd.toDate());
  }

  public stepBack(timespan: Timespan): Timespan {
    const d = this.getDuration(timespan);
    const from = moment(timespan.from).subtract(d).unix() * 1000;
    const to = moment(timespan.to).subtract(d).unix() * 1000;
    return new Timespan(from, to);
  }

  public stepForward(timespan: Timespan): Timespan {
    const d = this.getDuration(timespan);
    const from = moment(timespan.from).add(d).unix() * 1000;
    const to = moment(timespan.to).add(d).unix() * 1000;
    return new Timespan(from, to);
  }

  /**
   * Increase timespan by custom interval
   * @param timespan
   * @param interval
   */
  public stepForwardCustom(timespan: Timespan, interval: number): Timespan {
    const from = moment(timespan.from).add(interval).unix() * 1000;
    const to = moment(timespan.to).add(interval).unix() * 1000;
    return new Timespan(from, to);
  }

  public overlaps(
    timeInterval: TimeInterval,
    from: number,
    to: number,
  ): boolean {
    const timespan = this.createTimespanOfInterval(timeInterval);
    if (timespan.from <= to && timespan.to >= from) {
      return true;
    }
    return false;
  }

  public containsIn(timeInterval: TimeInterval, timestamp: number) {
    const timespan = this.createTimespanOfInterval(timeInterval);
    return timespan.from <= timestamp && timestamp <= timespan.to;
  }

  public createTimespanOfInterval(timeInterval: TimeInterval): Timespan {
    if (timeInterval instanceof Timespan) {
      return timeInterval;
    } else if (timeInterval instanceof BufferedTime) {
      const d = moment.duration(timeInterval.bufferInterval / 2);
      const from = moment(timeInterval.timestamp).subtract(d).unix() * 1000;
      const to = moment(timeInterval.timestamp).add(d).unix() * 1000;
      return new Timespan(from, to);
    }
    throw new Error('Wrong time interval!');
  }

  public getBufferedTimespan(
    timespan: Timespan,
    factor: number,
    maxBufferInMs?: number,
  ): Timespan {
    const durationMillis = this.getDuration(timespan).asMilliseconds();
    let buffer = durationMillis * factor;
    if (maxBufferInMs && buffer > maxBufferInMs) {
      buffer = maxBufferInMs;
    }
    const from = timespan.from - buffer;
    const to = timespan.to + buffer;
    return new Timespan(from, to);
  }

  public saveTimespan(param: string, timespan: Timespan) {
    this.localStorage.save(param, timespan);
  }

  public loadTimespan(param: string): Timespan | null {
    const json = this.localStorage.load<object>(param);
    if (json) {
      return plainToClass<Timespan, object>(Timespan, json);
    }
    return null;
  }

  public initTimespan(): Timespan {
    const now = new Date();
    const start = moment(now).startOf('day').unix() * 1000;
    const end = moment(now).endOf('day').unix() * 1000;
    return new Timespan(start, end);
  }

  public generateTimespan(
    defaultTimeseriesTimeduration: MomentInputObject,
    align: 'start' | 'center' | 'end',
  ): Timespan {
    const now = new Date();
    const d = duration(defaultTimeseriesTimeduration);
    switch (align) {
      case 'start':
        return new Timespan(now.getTime(), now.getTime() + d.asMilliseconds());
      case 'end':
        return new Timespan(now.getTime() - d.asMilliseconds(), now.getTime());
      case 'center':
      default:
        const half = d.asMilliseconds() / 2;
        return new Timespan(now.getTime() - half, now.getTime() + half);
    }
  }

  private getDuration(timespan: Timespan): moment.Duration {
    const from = moment(timespan.from);
    const to = moment(timespan.to);
    return moment.duration(to.diff(from));
  }
}
