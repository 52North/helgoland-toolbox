import { Timespan } from '@helgoland/core';

import { EventingFilter } from './common';

export interface EventFilter extends EventingFilter {
    latest?: boolean;
    subscriptions?: string;
    timespan?: Timespan;
}
