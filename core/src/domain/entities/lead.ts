import { ID } from '../value-objects/id';
import { Name } from '../value-objects/name';
import { Email } from '../value-objects/email';
import { PhoneNumber } from '../value-objects/phone-number';
import { LeadStatusValue } from '../value-objects/lead-status';

export type LeadProps = {
  id: ID | string;
  name: Name | string;
  email?: Email | string | null;
  phone_number: PhoneNumber | string;
  created_at: Date;
  updated_at?: Date | null;
  status: LeadStatusValue;
  partner_id: ID | string;
  last_contacted_at?: Date | null; // Novo: Último contato com o Lead
  notes?: string; // Novo: Anotações sobre o Lead
};

export type CreateLeadCommand = {
  name: string;
  email?: string;
  phone_number: string;
  status?: LeadStatusValue;
  partner_id: string;
};

export class Lead {
  private _id: ID;
  private _partner_id: ID;
  private _name: Name;
  private _email: Email | null;
  private _phone_number: PhoneNumber;
  private _created_at: Date;
  private _updated_at: Date | null;
  private _status: LeadStatusValue;
  private _last_contacted_at: Date | null;
  private _notes: string;

  constructor(props: LeadProps) {
    this._id = props.id instanceof ID ? props.id : new ID(props.id);
    this._partner_id =
      props.partner_id instanceof ID
        ? props.partner_id
        : new ID(props.partner_id);
    this._name = props.name instanceof Name ? props.name : new Name(props.name);
    this._email =
      props.email instanceof Email
        ? props.email
        : props.email
          ? new Email(props.email)
          : null;
    this._phone_number =
      props.phone_number instanceof PhoneNumber
        ? props.phone_number
        : new PhoneNumber(props.phone_number);
    this._created_at = props.created_at;
    this._updated_at = props.updated_at || null;
    this._status = props.status;
    this._last_contacted_at = props.last_contacted_at || null;
    this._notes = props.notes || '';

    // Validações no construtor
    if (!this._partner_id) throw new Error('Partner ID is required');
    if (!this._name) throw new Error('Lead name cannot be empty');
    if (!this._phone_number) throw new Error('Phone number is required');
    if (!this._status) throw new Error('Lead status is required');
  }

  public static create(command: CreateLeadCommand): Lead {
    return new Lead({
      id: new ID(),
      name: new Name(command.name),
      email: command.email ? new Email(command.email) : null,
      phone_number: new PhoneNumber(command.phone_number),
      created_at: new Date(),
      status: command.status || LeadStatusValue.NEW,
      partner_id: new ID(command.partner_id),
    });
  }

  // Métodos de Negócio
  public canSchedule(): boolean {
    return (
      this._status === LeadStatusValue.NEW ||
      this._status === LeadStatusValue.CONTACTED
    );
  }

  public canCancel(): boolean {
    return this._status === LeadStatusValue.SCHEDULED;
  }

  public updateContactInfo(phoneNumber?: string, email?: string): void {
    if (phoneNumber && phoneNumber !== this._phone_number.value) {
      this._phone_number = new PhoneNumber(phoneNumber);
      this._updated_at = new Date();
    }
    if (email !== undefined && (!this._email || email !== this._email.value)) {
      this._email = email ? new Email(email) : null;
      this._updated_at = new Date();
    }
  }

  public markAsContacted(): void {
    if (this._status === LeadStatusValue.NEW) {
      this._status = LeadStatusValue.CONTACTED;
      this._last_contacted_at = new Date();
      this._updated_at = new Date();
    }
  }

  public addNote(note: string): void {
    if (note) {
      this._notes = this._notes ? `${this._notes}\n${note}` : note;
      this._updated_at = new Date();
    }
  }

  // Getters
  get id(): string {
    return this._id.value;
  }

  get partner_id(): string {
    return this._partner_id.value;
  }

  get name(): string {
    return this._name.value;
  }

  get email(): string | null {
    return this._email?.value || null;
  }

  get phone_number(): string {
    return this._phone_number.value;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date | null {
    return this._updated_at;
  }

  get status(): LeadStatusValue {
    return this._status;
  }

  get last_contacted_at(): Date | null {
    return this._last_contacted_at;
  }

  get notes(): string {
    return this._notes;
  }

  // Setters
  set phone_number(phoneNumber: PhoneNumber | string) {
    const newPhone =
      phoneNumber instanceof PhoneNumber
        ? phoneNumber
        : new PhoneNumber(phoneNumber);
    if (!newPhone.equals(this._phone_number)) {
      this._phone_number = newPhone;
      this._updated_at = new Date();
    }
  }

  set email(email: Email | string | null) {
    const newEmail =
      email instanceof Email ? email : email ? new Email(email) : null;
    if (newEmail?.value !== this._email?.value) {
      this._email = newEmail;
      this._updated_at = new Date();
    }
  }

  set status(status: LeadStatusValue) {
    if (status && status !== this._status) {
      this._status = status;
      this._updated_at = new Date();
    }
  }

  toJSON() {
    return {
      id: this.id,
      partner_id: this.partner_id,
      name: this.name,
      email: this.email,
      phone_number: this.phone_number,
      created_at: this.created_at,
      updated_at: this.updated_at,
      status: this.status,
      last_contacted_at: this.last_contacted_at,
      notes: this.notes,
    };
  }
}
