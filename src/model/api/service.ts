import { Parameter } from './parameter';

export class Service extends Parameter {
    public providerUrl: string;
    public quantities: ServiceQuantities;
}

export interface ServiceQuantities {
    platforms?: number;
    stations?: number;
}
