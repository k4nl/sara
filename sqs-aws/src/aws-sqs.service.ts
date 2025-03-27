import { SqsService } from '@core/application/services/sqs.service';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

export type AwsSqsServiceProps = {
  region?: string;
  account_id: string;
  response_queue_name: string;
  credentials: {
    access_key_id: string;
    secret_access_key: string;
  };
};

@Injectable()
export class AwsSqsService extends SqsService {
  private sqs: AWS.SQS;
  private readonly region: string;
  private readonly account_id: string;
  private readonly response_queue_name: string;

  constructor(props: AwsSqsServiceProps) {
    super();

    this.validateProps(props);

    this.region = props.region || 'us-east-1';
    this.account_id = props.account_id;
    this.response_queue_name = props.response_queue_name;

    this.sqs = new AWS.SQS({
      region: this.region,
      credentials: {
        accessKeyId: props.credentials.access_key_id,
        secretAccessKey: props.credentials.secret_access_key,
      },
    });
  }

  private validateProps(props: AwsSqsServiceProps): void {
    if (!props.account_id) {
      throw new Error('Account ID is required');
    }

    if (!props.credentials.access_key_id) {
      throw new Error('Access key ID is required');
    }

    if (!props.credentials.secret_access_key) {
      throw new Error('Secret access key is required');
    }

    if (!props.response_queue_name) {
      throw new Error('Response queue name is required');
    }
  }

  get responseQueueUrl(): string {
    return `https://sqs.${this.region}.amazonaws.com/${this.account_id}/${this.response_queue_name}`;
  }

  getQueueUrl(queue_name: string): string {
    return `https://sqs.${this.region}.amazonaws.com/${this.account_id}/${queue_name}`;
  }
}
