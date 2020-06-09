import { EventingEndpoint, Id } from './common';
import { Rule } from './rules';

export interface Notification extends Id {
    label: string;
    publication: Id;
    rules?: Rule[];
}

export interface NotificationResults extends EventingEndpoint<Notification> { }
