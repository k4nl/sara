export interface IMessagingService<T> {
  sendMessage(queueUrl: string, message: T): Promise<void>;
  subscribeToQueue(queueUrl: string, callback: (message: T) => void): void;
}
