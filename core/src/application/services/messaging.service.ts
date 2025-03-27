import { Injectable } from '@nestjs/common';
import { IMessagingService } from '../interfaces/messaging.interface';

@Injectable()
export abstract class MessagingService<T> implements IMessagingService<T> {
  abstract sendMessage(queueUrl: string, message: T): Promise<void>;
  abstract subscribeToQueue(
    queueUrl: string,
    callback: (message: any) => void,
  ): void;
}
