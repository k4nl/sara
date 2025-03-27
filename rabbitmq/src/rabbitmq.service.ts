// @myapp/rabbitmq/src/rabbitmq.service.ts
import { SqsService } from '@core/application/services/sqs.service';
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

type RabbitMqServiceProps = {
  url: string;
  queue_name: string;
};

@Injectable()
export class RabbitMqService extends SqsService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly url: string;
  private readonly queueName: string;

  constructor(props: RabbitMqServiceProps) {
    super();

    this.validateProps(props);
    this.url = props.url;
    this.queueName = props.queue_name;
    this.setupRabbitMq();
  }

  private validateProps(props: RabbitMqServiceProps): void {
    if (!props.url) {
      throw new Error('URL is required');
    }

    if (!props.queue_name) {
      throw new Error('Queue name is required');
    }
  }

  async setupRabbitMq() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
  }

  get responseQueueUrl(): string {
    return this.getQueueUrl(this.queueName);
  }

  getQueueUrl(queueName: string): string {
    return `${this.url}/${queueName}`;
  }
}
