import { SessionID } from '../value-objects';
import { DomainEvent } from './domain-event';
import { EventsName } from './events.enum';

export interface MessageReceivedPayload {
  session_id: string | SessionID;
  message: string;
}

export class MessageReceivedEvent
  implements DomainEvent<MessageReceivedPayload>
{
  readonly name = EventsName.MESSAGE_RECEIVED;

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
