import { BasePromptContext } from '../prompts/base-context';
import { SessionID } from '../value-objects';
import { Lead } from './lead';
import { Partner } from './partner';

export enum ConversationRole {
  SYSTEM = 'system',
  PERSONA = 'persona',
  LEAD = 'lead',
}

interface Message {
  role: ConversationRole;
  content: string;
}

export class Conversation {
  private readonly context = BasePromptContext.init().value;

  private history: Message[] = [];

  constructor(
    private readonly sessionId: SessionID,
    private lead: Lead,
    private partner: Partner,
  ) {
    this.history.push({ role: ConversationRole.SYSTEM, content: this.context });
  }

  getSessionId(): string {
    return this.sessionId.value;
  }

  getLead(): Lead | undefined {
    return this.lead;
  }

  setLead(lead: Lead): void {
    this.lead = lead;
  }

  getPartner(): Partner | undefined {
    return this.partner;
  }

  setPartner(partner: Partner): void {
    this.partner = partner;
  }

  addMessage(role: ConversationRole, content: string): void {
    this.history.push({ role, content });
  }

  getHistory(): Message[] {
    return this.history;
  }
}
