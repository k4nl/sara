export interface ILogger<T> {
  info(message: string, props: T): void;
  warn(message: string, props: T): void;
  error(message: string, props: T): void;
}
