import { ValueObject } from './value-object';

export class Timestamp extends ValueObject<number> {
  constructor(value: Date | number) {
    super(value instanceof Date ? value.getTime() : value);
    this.isValid();
  }

  private isValid(): void {
    if (this.value < 0) {
      throw new Error('Invalid timestamp');
    }
  }
}
