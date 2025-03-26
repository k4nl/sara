import { ValueObject } from './value-object';

export class Email extends ValueObject<string> {
  constructor(email: string) {
    super(email);
    this.isValid();
  }

  private isValid(): void {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!pattern.test(this._value)) {
      throw new Error('Invalid email');
    }
  }

  override get value(): string {
    return this._value.trim().toLowerCase();
  }
}
