import { SessionID } from '../value-objects';
import { EventsName } from './events.enum';

export interface DomainEvent<T = unknown> {
  readonly name: EventsName;
  readonly session_id: SessionID;
  getPayload(): T;
}
