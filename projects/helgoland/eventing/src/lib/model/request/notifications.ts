import { EventingFilter } from './common';

export interface NotificationFilter extends EventingFilter {
    publications?: string[];
}
