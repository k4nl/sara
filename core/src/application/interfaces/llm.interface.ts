import { Message } from '../../domain/entities/conversation';

export interface ILLMService {
  generateResponse(history: Message[]): Promise<string>;
}
