import { InjectionToken } from '@angular/core';

/**
 * Configuration for the HelgolandCachingModule
 */
export interface CacheConfig {
    /**
     * Duration in milliseconds, how long equal request will be cached until refresh
     */
    cachingDurationInMilliseconds?: number;
}

export const CacheConfigService = new InjectionToken<CacheConfig>('CacheConfigService');
