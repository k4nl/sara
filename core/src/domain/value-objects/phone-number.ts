import { ValueObject } from './value-object';

export class PhoneNumber extends ValueObject<string> {
  constructor(phoneNumber: string) {
    super(phoneNumber);
    this.isValid();
  }

  private isValid() {
    if (!this.value) {
      throw new Error('Phone number is required');
    }

    if (!/^\d{10,11}$/.test(this.value)) {
      throw new Error(`Invalid phone number: ${this.value}`);
    }
  }
}
