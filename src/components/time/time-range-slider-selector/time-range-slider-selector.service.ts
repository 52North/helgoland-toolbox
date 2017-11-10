import { Injectable } from '@angular/core';

import { IdCache } from '../../../model/internal/id-cache';
import { Timespan } from '../../../model/internal/timeInterval';

@Injectable()
export class TimeRangeSliderSelectorCache extends IdCache<Timespan> { }
