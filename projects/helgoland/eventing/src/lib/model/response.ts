export interface Id {
    id: string;
    href: string;
}

export interface EventingEvent extends Id {
    label: string;
    eventType: Id;
    notificationLevel: Id;
    publication: Id;
    subscription: Id;
    timestamp: number;
    timestampCreated: number;
    data?: {
        eventTrigger: {
            code: number;
            label: string;
            threshold: number;
            thresholdUnit: string;
        }
        previousTimestamp: number;
        previousValue: number;
        unit: string;
        value: number;
    };
}

export interface EventingEventResults {
    data: EventingEvent[];
    metadata: CollectionMetadata;
}

export interface EventingSubscription extends Id {
    deliveryMethod: Id;
    template: EventingTemplate;
    user: Id;
}

export interface EventingSubscriptionResults {
    data: EventingSubscription[];
    metadata: CollectionMetadata;
}

export interface EventingTemplate extends Id {
    label: string;
    publication: Id;
}

export interface CollectionMetadata {
    limit: number;
    offset: number;
    total: number;
}
