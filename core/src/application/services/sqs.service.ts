// @myapp/core/src/application/services/sqs.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class SqsService {
  abstract get responseQueueUrl(): string;
  abstract getQueueUrl(queueName: string): string;
}
