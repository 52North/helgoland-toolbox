export interface Id {
    id: string;
    href?: string;
}

export interface CollectionMetadata {
    limit: number;
    offset: number;
    total: number;
}

export interface EventingEndpoint<T> {
    data: T[];
    metadata: CollectionMetadata;
}

export interface EventTrigger {
    code: number;
    label: string;
    threshold: number;
    thresholdUnit: string;
}

export interface EventType extends Id {
    label: string;
}

export interface NotificationLevel extends Id {
    label: string;
}
