import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import moment from 'moment';

import { LocalStorage } from '../local-storage/local-storage.service';
import { BufferedTime, TimeInterval, Timespan } from '../model/internal/timeInterval';

@Injectable()
export class Time {

    constructor(
        protected localStorage: LocalStorage
    ) { }

    public centerTimespan(timespan: Timespan, date: Date): Timespan {
        const halfduration = this.getDuration(timespan).asMilliseconds() / 2;
        const from = moment(date).subtract(halfduration).unix() * 1000;
        const to = moment(date).add(halfduration).unix() * 1000;
        return new Timespan(from, to);
    }

    public centerTimespanWithDuration(timespan: Timespan, duration: moment.Duration): Timespan {
        const half = duration.asMilliseconds() / 2;
        const center = this.getCenterOfTimespan(timespan);
        return new Timespan(center - half, center + half);
    }

    public getCenterOfTimespan(timespan: Timespan): number {
        return timespan.from + (timespan.to - timespan.from) / 2;
    }

    public stepBack(timespan: Timespan): Timespan {
        const duration = this.getDuration(timespan);
        const from = moment(timespan.from).subtract(duration).unix() * 1000;
        const to = moment(timespan.to).subtract(duration).unix() * 1000;
        return new Timespan(from, to);
    }

    public stepForward(timespan: Timespan): Timespan {
        const duration = this.getDuration(timespan);
        const from = moment(timespan.from).add(duration).unix() * 1000;
        const to = moment(timespan.to).add(duration).unix() * 1000;
        return new Timespan(from, to);
    }

    public overlaps(timeInterval: TimeInterval, from: number, to: number): boolean {
        const timespan = this.createTimespanOfInterval(timeInterval);
        if (timespan.from <= to && timespan.to >= from) {
            return true;
        }
        return false;
    }

    public createTimespanOfInterval(timeInterval: TimeInterval): Timespan {
        if (timeInterval instanceof Timespan) {
            return timeInterval;
        } else if (timeInterval instanceof BufferedTime) {
            const duration = moment.duration(timeInterval.bufferInterval / 2);
            const from = moment(timeInterval.timestamp).subtract(duration).unix() * 1000;
            const to = moment(timeInterval.timestamp).add(duration).unix() * 1000;
            return new Timespan(from, to);
        } else {
            console.error('Wrong time interval!');
        }
    }

    public getBufferedTimespan(timespan: Timespan, factor: number): Timespan {
        const durationMillis = this.getDuration(timespan).asMilliseconds();
        const from = moment(timespan.from).subtract(durationMillis * factor).unix() * 1000;
        const to = moment(timespan.to).add(durationMillis * factor).unix() * 1000;
        return new Timespan(from, to);
    }

    public saveTimespan(param: string, timespan: Timespan) {
        this.localStorage.save(param, timespan);
    }

    public loadTimespan(param: string): Timespan {
        const json = this.localStorage.load(param);
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

    private getDuration(timespan: Timespan): moment.Duration {
        const from = moment(timespan.from);
        const to = moment(timespan.to);
        return moment.duration(to.diff(from));
    }
}
