import { EventTrigger, EventType, Id, NotificationLevel } from './common';

export interface Rule extends Id {
    eventTrigger: EventTrigger;
    eventType: EventType;
    notificationLevel: NotificationLevel;
}
