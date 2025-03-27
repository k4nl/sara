import { DomainEvent } from './domain-event';
import { SessionID } from '../value-objects';
import { EventsName } from './events.enum';

export type ActionRequestedEventProps = {
  session_id: string | SessionID;
  action_name: string;
  payload: Record<string, unknown>;
};

export class ActionRequestedEvent<T = Record<string, unknown>>
  implements
    DomainEvent<{
      session_id: string | SessionID;
      action_name: string;
      payload: T;
    }>
{
  readonly name = EventsName.ACTION_REQUESTED;
  public session_id: SessionID;
  public action_name: string;
  public payload: T;

  constructor(props: ActionRequestedEventProps) {
    if (!props.action_name) {
      throw new Error('Action name is required');
    }

    this.session_id =
      props.session_id instanceof SessionID
        ? props.session_id
        : new SessionID(props.session_id);
    this.action_name = props.action_name;
    this.payload = props.payload as T;
  }

  getPayload(): { session_id: string; action_name: string; payload: T } {
    return {
      session_id: this.session_id.toString(),
      action_name: this.action_name,
      payload: this.payload,
    };
  }
}
