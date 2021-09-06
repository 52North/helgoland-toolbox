import { EventingEndpoint, Id } from './common';
import { Notification } from './notifications';

export interface Subscription extends Id {
    deliveryMethod: Id;
    notification: Notification;
    user: Id;
}

export interface SubscriptionResults extends EventingEndpoint<Subscription> { }
