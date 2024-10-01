import { Id, EventingEndpoint } from './common';
import { Notification } from './notifications';

export interface Publication extends Id {
  label: string;
  seriesHref: string;
  notifications: Notification[];
  details?: {
    category: string;
    feature: string;
    phenomenon: string;
    procedure: string;
    unit: string;
  };
}

export interface PublicationResults extends EventingEndpoint<Publication> {}
