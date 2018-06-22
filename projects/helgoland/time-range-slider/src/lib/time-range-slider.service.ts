import { Injectable } from '@angular/core';
import { IdCache, Timespan } from '@helgoland/core';

@Injectable()
export class TimeRangeSliderCache extends IdCache<Timespan> { }
