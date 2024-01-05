import { EventingEndpoint, Id } from './common';

export interface Event extends Id {
  label: string;
  eventType: Id;
  notificationLevel: Id;
  publication: Id;
  subscription: Id;
  timestamp: number;
  timestampCreated: number;
  eventDetails?: {
    eventTrigger: {
      code: number;
      label: string;
      threshold: number;
      thresholdUnit: string;
    };
    previousTimestamp: number;
    previousValue: number;
    unit: string;
    value: number;
  };
}

export interface EventResults extends EventingEndpoint<Event> {}
