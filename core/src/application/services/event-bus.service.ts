import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { DomainEvent } from '../../domain/events/domain-event';

@Injectable()
export class EventBusService {
  private emitter = new EventEmitter();

  publish<T>(event: DomainEvent<T>): void {
    this.emitter.emit(event.name, event.getPayload());
  }

  subscribe<T>(eventName: string, handler: (payload: T) => void): void {
    this.emitter.on(eventName, handler);
  }
}
