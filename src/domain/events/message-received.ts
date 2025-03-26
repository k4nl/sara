import { SessionID } from '../value-objects';
import { DomainEvent } from './domain-event';

export interface MessageReceivedPayload {
  session_id: string | SessionID;
  message: string;
}

export class MessageReceivedEvent
  implements DomainEvent<MessageReceivedPayload>
{
  readonly name = 'MessageReceived';

  constructor(
    public readonly session_id: SessionID,
    public readonly message: string,
  ) {}

  getPayload(): MessageReceivedPayload {
    return {
      session_id: this.session_id.toString(),
      message: this.message,
    };
  }
}
