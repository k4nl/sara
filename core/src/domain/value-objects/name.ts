import { ValueObject } from './value-object';

export class Name extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.isValid();
  }

  private isValid(): void {
    if (!this._value || this._value.length < 2 || this._value.length > 50) {
      throw new Error('Invalid name');
    }

    if (this._value.split(' ').length < 2) {
      throw new Error(`Last name of: ${this._value} is missing`);
    }
  }

  override get value(): string {
    const name = this._value.trim().toLowerCase();

    const words = name.split(' ');

    return words
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}
