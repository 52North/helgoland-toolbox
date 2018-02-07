import { GraphMessageType } from './graph-message-type';

export interface GraphMessage {
    type: GraphMessageType;
    message: string;
}
