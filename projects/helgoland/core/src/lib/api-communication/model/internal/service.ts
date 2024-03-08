export class HelgolandService {

    constructor(
        public id: string,
        public apiUrl: string,
        public label: string,
        public type: string,
        public version: string,
        public quantities?: HelgolandServiceQuantities
    ) { }
}


export interface HelgolandServiceQuantities {
    categories?: number;
    features?: number;
    offerings?: number;
    phenomena?: number;
    procedures?: number;
    datasets?: number;
    platforms?: number;
}
