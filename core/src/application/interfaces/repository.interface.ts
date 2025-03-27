export interface IRepository<T> {
  save?(entity: T): Promise<void>;
  findById?(id: string): Promise<T | null>;
  update?(entity: T): Promise<void>;
  delete?(id: string): Promise<void>;
}
