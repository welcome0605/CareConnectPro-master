import { BaseModel } from "./base.model";
import { Contact, Address, Place } from "./peopleplace.model";

export interface Company extends Place {
  id?: string;
  normalizedId?: number;
  name?: string;
  longName?: string;
}

export interface CompanySubscription extends BaseModel {
  id?: string;
  companyId?: string;
  normalizedId?: number;
  packageId?: string;
  totalAmount?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface CompanySystemSettings extends BaseModel {
  id?: string;
  companyId?: string;
  defaultTheme?: string;
  enableChat?: boolean;
  enableUserTheme?: boolean;
  enableMessages?: boolean;
  enableBroadcastMsgs?: boolean;
  logoName?: string;
  logo?: string;
}

export interface Department extends BaseModel {
  id?: string;
  companyId?: string;
  name?: string;
  description?: string;
  parentId?: string;
}
