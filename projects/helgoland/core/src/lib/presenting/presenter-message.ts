import { PresenterMessageType } from './presenter-message-type';

export interface PresenterMessage {
  type: PresenterMessageType;
  message: string;
}
