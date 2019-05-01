import { CodesDefinition, EditHelperActionType } from "../enums";
import { BaseModel } from "./base.model";

export interface AppCodes {
  Code?: any[CodesDefinition];
}

export interface CountryCodes {
  id?: string;
  value?: string;
}

export interface StateUS {
  id?: string;
  value?: string;
}

export interface ZipCodeUS {
  id?: string;
  value?: string;
}

export interface CCardType {
  id?: number;
  value?: string;
}

export interface CCYear {
  id?: number;
  value?: number;
}

export interface AppAsset extends BaseModel {
  id?: string;
  name?: string;
}

export interface AppUserType {
  id?: string;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface GenderCode {
  id?: string;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface PrefixCode {
  id?: string;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface SalaryCode {
  id?: string;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface SuffixCode {
  id?: string;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface PracticeCode {
  id?: string;
  specialization?: string;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface ServiceCode {
  id?: string;
  specialization?: string;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface EditHelperUserAction {
  actionType?: EditHelperActionType;
  isSuccess?: boolean;
}

export interface MessageStatus {
  isSuccessful?: boolean;
  resultText?: string;
}

export interface ResetPasswordMessage {
  email?: string;
  subject?: string;
  msgContent?: string;
  authCode?: string;
  token?: string;
}

export interface FileAttachment {
  id?: string;
  originalName?: string;
  fileSize?: string;
}

export interface KeyValuePair {
  name: string;
  value: string;
}
