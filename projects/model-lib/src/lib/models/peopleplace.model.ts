import { BaseModel, BaseAddress } from "./base.model";
import {
  AddressType,
  ContactType,
  IdType,
  RaceType,
  MaritalStatus
} from "../enums";

export interface People extends BaseModel {
  prefix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  dateOfBirth?: Date;
  gender?: string;
  photoName?: string;
  race?: RaceType;
  maritalStatus?: MaritalStatus;
  identifications?: Identification[];
  contacts?: Contact[];
  addresses?: Address[];
}

export interface Place extends BaseModel {
  companyName?: string;
  addresses?: Address[];
  contacts?: Contact[];
  identifications?: Identification[];
}

export interface Address extends BaseAddress {
  id?: string;
  addressTypeId?: AddressType;
  isPrimary?: boolean;
}

export interface Contact extends BaseModel {
  id?: string;
  contactTypeId?: ContactType;
  value?: string;
}

export interface Identification extends BaseModel {
  id?: string;
  idTypeId?: IdType;
  value?: string;
  issueAuthority?: string;
  memo?: string;
  issueDate?: Date;
  expiryDate?: Date;
}
