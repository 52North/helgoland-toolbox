import { PresenterMessageType } from '@helgoland/core';

export interface PresenterMessage {
    type: PresenterMessageType;
    message: string;
}
