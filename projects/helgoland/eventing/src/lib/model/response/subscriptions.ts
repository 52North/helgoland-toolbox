import { EventingEndpoint, Id } from './common';

export interface Subscription extends Id {
    deliveryMethod: Id;
    notification: Notification;
    user: Id;
}

export interface SubscriptionResults extends EventingEndpoint<Subscription> { }
