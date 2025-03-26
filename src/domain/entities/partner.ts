import { ID } from '../value-objects/id';
import { Name } from '../value-objects/name';
import { Email } from '../value-objects/email';

export type PartnerProps = {
  id: ID | string;
  name: Name | string;
  email: Email | string;
  created_at: Date;
  updated_at?: Date | null;
  services_offered?: string[]; // Novo: Lista de serviços oferecidos
};

export type CreatePartnerCommand = {
  name: string;
  email: string;
  services_offered?: string[];
};

export class Partner {
  private _id: ID;
  private _name: Name;
  private _email: Email;
  private _created_at: Date;
  private _updated_at: Date | null;

  // SOBRE OS SERVICOS OFERECIDOS CRIAR UMA NOVA CLASSE
  // PORQUE PODE SER QUE OS SERVICOS OFERECIDOS TENHAM MAIS INFORMACOES
  // COMO TEMPO DE DURACAO, PRECO, DISPONIBILIDADE EM LOCAIS DIFERENTES DE TRABALHO COMO
  // POR EXEMPLO UM PARCEIRO PODE ATUAR EM DIFERENTES CLINICAS E EM CADA CLINICA ELE
  // OFERECE SERVICOS DIFERENTES

  private _services_offered: string[];

  constructor(props: PartnerProps) {
    this._id = props.id instanceof ID ? props.id : new ID(props.id);
    this._name = props.name instanceof Name ? props.name : new Name(props.name);
    this._email =
      props.email instanceof Email ? props.email : new Email(props.email);
    this._created_at = props.created_at;
    this._updated_at = props.updated_at || null;
    this._services_offered = props.services_offered || [];
  }

  public static create(command: CreatePartnerCommand): Partner {
    return new Partner({
      id: new ID(),
      name: new Name(command.name),
      email: new Email(command.email),
      created_at: new Date(),
      services_offered: command.services_offered,
    });
  }

  // Getters
  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name.value;
  }

  get email(): string {
    return this._email.value;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date | null {
    return this._updated_at;
  }

  get services_offered(): string[] {
    return [...this._services_offered];
  }

  // Setters
  set name(name: Name | string) {
    const newName = name instanceof Name ? name : new Name(name);
    if (!newName.equals(this._name)) {
      this._name = newName;
      this._updated_at = new Date();
    }
  }

  set email(email: Email | string) {
    const newEmail = email instanceof Email ? email : new Email(email);
    if (!newEmail.equals(this._email)) {
      this._email = newEmail;
      this._updated_at = new Date();
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
      services_offered: this.services_offered,
    };
  }
}
