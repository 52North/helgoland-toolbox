import { EventingFilter } from './common';

export interface PublicationFilter extends EventingFilter {
  feature?: string;
}
