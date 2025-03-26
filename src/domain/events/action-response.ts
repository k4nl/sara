import { SessionID } from '../value-objects';
import { DomainEvent } from './domain-event';

export enum ActionResponseStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export interface ActionResponsePayload {
  status: ActionResponseStatus;
  message?: string;
  data?: Record<string, unknown>; // Pode ser refinado por cada Lambda
}

export type ActionResponseEventProps = {
  session_id: string | SessionID;
  action_name: string;
  response: ActionResponsePayload;
};

export class ActionResponseEvent
  implements
    DomainEvent<{
      session_id: string;
      action_name: string;
      response: ActionResponsePayload;
    }>
{
  readonly name = 'ActionResponse';
  public session_id: SessionID;
  public action_name: string;
  public response: ActionResponsePayload;

  constructor(props: ActionResponseEventProps) {
    if (!props.action_name) {
      throw new Error('Action name is required');
    }

    this.session_id =
      props.session_id instanceof SessionID
        ? props.session_id
        : new SessionID(props.session_id);

    this.action_name = props.action_name;
    this.response = props.response;
  }

  getPayload(): {
    session_id: string;
    action_name: string;
    response: ActionResponsePayload;
  } {
    return {
      session_id: this.session_id.toString(),
      action_name: this.action_name,
      response: this.response,
    };
  }
}
