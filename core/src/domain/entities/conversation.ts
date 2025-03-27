import { BasePromptContext } from '../prompts/base-context';
import { SessionID } from '../value-objects';
import { Lead } from './lead';
import { Partner } from './partner';

export enum ConversationRole {
  SYSTEM = 'system',
  PERSONA = 'persona',
  LEAD = 'lead',
}

export interface Message {
  role: ConversationRole;
  content: string;
}

export type ConversationProps = {
  session_id: string | SessionID;
  lead: Lead;
  partner: Partner;
};

export class Conversation {
  private readonly context = BasePromptContext.init().value;
  private readonly session_id: SessionID;
  private readonly lead: Lead;
  private readonly partner: Partner;
  private history: Message[] = [];

  constructor(props: ConversationProps) {
    this.session_id =
      props.session_id instanceof SessionID
        ? props.session_id
        : new SessionID(props.session_id);
    this.lead = props.lead;
    this.partner = props.partner;
    this.history.push({ role: ConversationRole.SYSTEM, content: this.context });
  }

  getSessionId(): string {
    return this.session_id.value;
  }

  getLead(): Lead {
    return this.lead;
  }

  getPartner(): Partner {
    return this.partner;
  }

  addMessage(role: ConversationRole, content: string): void {
    this.history.push({ role, content });
  }

  getHistory(): Message[] {
    return this.history;
  }
}
