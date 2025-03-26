import { SessionID } from '../value-objects';

export interface DomainEvent<T = unknown> {
  readonly name: string;
  readonly session_id: SessionID;
  getPayload(): T;
}
