import { Injectable } from '@nestjs/common';
import {
  Conversation,
  ConversationRole,
} from '../../domain/entities/conversation';
import { EventBusService } from './event-bus.service';
import { ILLMService } from '../interfaces/llm.interface';
import { ILogger } from '../interfaces/logger.interface';
import { IMessagingService } from '../interfaces/messaging.interface';
import { MessageReceivedEvent } from '../../domain/events/message-received';
import { EventsName } from 'core/src/domain/events/events.enum';
import {
  ActionResponseEvent,
  ActionResponseEventProps,
  ActionResponsePayload,
} from 'core/src/domain/events/action-response';
import { SessionID } from 'core/src/domain/value-objects';
import { Lead } from 'core/src/domain/entities/lead';
import { Partner } from 'core/src/domain/entities/partner';
import { ActionRequestedEvent } from 'core/src/domain/events/action-requested';
import { SqsService } from './sqs.service';

type HandleMessagePayload = {
  session_id: string | SessionID;
  message: string;
  props: {
    lead: Lead;
    partner: Partner;
  };
};

type HandleResponsePayload = {
  session_id: string | SessionID;
  action_name: string;
  response: ActionResponsePayload;
  props: {
    lead: Lead;
    partner: Partner;
  };
};

type ConversationServiceProps = {
  eventBus: EventBusService;
  llm: ILLMService;
  logger: ILogger<any>;
  messaging: IMessagingService<ActionResponseEventProps>;
  sqs: SqsService;
};

@Injectable()
export class ConversationService {
  private conversations: Map<string, Conversation> = new Map();
  private eventBus: EventBusService;
  private llm: ILLMService;
  private logger: ILogger<any>;
  private messaging: IMessagingService<ActionResponseEventProps>;
  private sqs: SqsService;

  constructor(props: ConversationServiceProps) {
    this.eventBus = props.eventBus;
    this.llm = props.llm;
    this.logger = props.logger;
    this.messaging = props.messaging;
    this.sqs = props.sqs;

    this.eventBus.subscribe(
      EventsName.MESSAGE_RECEIVED,
      (payload: HandleMessagePayload) => this.handleMessage(payload),
    );
    this.eventBus.subscribe(
      EventsName.ACTION_RESPONSE,
      (payload: HandleResponsePayload) => this.handleResponse(payload),
    );

    this.setupMessaging();
  }

  private getConversation(
    session_id: SessionID,
    props: { lead: Lead; partner: Partner },
  ): Conversation {
    if (!this.conversations.has(session_id.value)) {
      this.conversations.set(
        session_id.value,
        new Conversation({ session_id, ...props }),
      );
    }
    return this.conversations.get(session_id.toString())!;
  }

  private async handleMessage(payload: HandleMessagePayload): Promise<void> {
    this.validateHandleMessagePayload(payload);

    const session_id =
      payload.session_id instanceof SessionID
        ? payload.session_id
        : new SessionID(payload.session_id);

    const conversation = this.getConversation(session_id, payload.props);

    conversation.addMessage(ConversationRole.LEAD, payload.message);
    const reply = await this.llm.generateResponse(conversation.getHistory());
    conversation.addMessage(ConversationRole.PERSONA, reply);

    this.parseLLMResponse(reply, conversation);
    this.logger.info(`Reply sent for session ${session_id.value}`, {
      session_id,
      reply,
      lead: conversation.getLead(),
      partner: conversation.getPartner(),
    });
  }

  private async handleResponse(payload: HandleResponsePayload): Promise<void> {
    const session_id =
      payload.session_id instanceof SessionID
        ? payload.session_id
        : new SessionID(payload.session_id);

    const conversation = this.getConversation(session_id, payload.props);

    conversation.addMessage(
      ConversationRole.SYSTEM,
      `Action ${payload.action_name} returned: ${JSON.stringify(payload.response)}`,
    );

    const reply = await this.llm.generateResponse(conversation.getHistory());
    conversation.addMessage(ConversationRole.PERSONA, reply);

    this.logger.info(`Reply sent for session ${session_id.value}`, {
      session_id,
      reply,
      lead: conversation.getLead(),
      partner: conversation.getPartner(),
    });
  }

  private parseLLMResponse(reply: string, conversation: Conversation): void {
    const action_match = reply.match(/Chame (\w+)/);
    if (action_match) {
      const action_name = action_match[1];

      const payload = {
        lead: conversation.getLead(),
        partner: conversation.getPartner(),
      };

      const event = new ActionRequestedEvent<ActionResponseEventProps>({
        action_name,
        payload,
        session_id: conversation.getSessionId(),
      });

      const event_payload = event.getPayload();

      this.eventBus.publish(event);

      this.messaging.sendMessage(`queue-${action_name.toLowerCase()}`, {
        action_name: event_payload.action_name,
        session_id: event_payload.session_id,
        response: event_payload.payload.response,
      });
    }
  }

  private setupMessaging(): void {
    this.messaging.subscribeToQueue(
      this.sqs.responseQueueUrl,
      (message: ActionResponseEventProps) => {
        const event = new ActionResponseEvent(message);

        this.eventBus.publish(event);
      },
    );
  }

  private validateHandleMessagePayload(payload: HandleMessagePayload): void {
    if (!payload.session_id) {
      throw new Error('Session ID is required');
    }

    if (!payload.message) {
      throw new Error('Message is required');
    }

    if (!payload.props) {
      throw new Error('Props are required');
    }

    if (!payload.props.lead) {
      throw new Error('Lead is required');
    }

    if (!payload.props.partner) {
      throw new Error('Partner is required');
    }
  }
}
