import { Timespan } from '@helgoland/core';

export interface EventingFilter {
    expanded?: boolean;
    offset?: number;
    limit?: number;
}

export interface EventingEventFilter extends EventingFilter {
    latest?: boolean;
    subscriptions?: string;
    timespan?: Timespan;
}

export interface EventingSubscriptionFilter extends EventingFilter { }
