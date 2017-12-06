import { Timespan } from '../../model/internal/timeInterval';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

export enum DefinedTimespan {
    LASTHOUR = 'last_hour',
    TODAY = 'today',
    YESTERDAY = 'yesterday',
    TODAY_YESTERDAY = 'today_yesterday',
    CURRENT_WEEK = 'current_week',
    LAST_WEEK = 'last_week',
    CURRENT_MONTH = 'current_month',
    LAST_MONTH = 'last_month',
    CURRENT_YEAR = 'current_year',
    LAST_YEAR = 'last_year'
}

@Injectable()
export class DefinedTimespanService {

    private intervals: Map<DefinedTimespan, () => Timespan> = new Map();

    constructor() {
        this.intervals.set(DefinedTimespan.LASTHOUR, () => {
            const from = moment().subtract(1, 'hours').unix() * 1000;
            const to = moment().unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.TODAY, () => {
            const from = moment().startOf('day').unix() * 1000;
            const to = moment().endOf('day').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.YESTERDAY, () => {
            const from = moment().subtract(1, 'days').startOf('day').unix() * 1000;
            const to = moment().subtract(1, 'days').endOf('day').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.TODAY_YESTERDAY, () => {
            const from = moment().subtract(1, 'days').startOf('day').unix() * 1000;
            const to = moment().endOf('day').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.CURRENT_WEEK, () => {
            const from = moment().startOf('isoWeek').unix() * 1000;
            const to = moment().endOf('isoWeek').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.LAST_WEEK, () => {
            const from = moment().subtract(1, 'weeks').startOf('isoWeek').unix() * 1000;
            const to = moment().subtract(1, 'weeks').endOf('isoWeek').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.CURRENT_MONTH, () => {
            const from = moment().startOf('month').unix() * 1000;
            const to = moment().endOf('month').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.LAST_MONTH, () => {
            const from = moment().subtract(1, 'months').startOf('month').unix() * 1000;
            const to = moment().subtract(1, 'months').endOf('month').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.CURRENT_YEAR, () => {
            const from = moment().startOf('year').unix() * 1000;
            const to = moment().endOf('year').unix() * 1000;
            return new Timespan(from, to);
        });
        this.intervals.set(DefinedTimespan.LAST_YEAR, () => {
            const from = moment().subtract(1, 'years').startOf('year').unix() * 1000;
            const to = moment().subtract(1, 'years').endOf('year').unix() * 1000;
            return new Timespan(from, to);
        });
    }

    public getInterval(intervalDescriber: DefinedTimespan): Timespan {
        if (this.intervals.has(intervalDescriber)) {
            return this.intervals.get(intervalDescriber)();
        }
    }
}
