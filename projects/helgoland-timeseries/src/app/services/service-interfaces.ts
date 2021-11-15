import { InjectionToken } from '@angular/core';

export interface DatasetPermalinkService {
    noPermalink();
    getPermaIds(): string[];
    validatePermaIds(ids: string[]);
}

export const DATASET_PERMALINK_SERVICE_INJECTION = new InjectionToken<DatasetPermalinkService>('DATASET_PERMALINK_SERVICE');