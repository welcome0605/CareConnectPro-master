import { BaseAddress, BaseModel } from "./base.model";
import { People } from "./peopleplace.model";

export interface Vendor extends People {
  id?: string;
  normalizedId?: number;
  companyId?: string;
  companyName?: string;
  isActive?: boolean;
  notes?: string;
  services?: VendorBusinessService[];
}

export interface VendorBusinessService extends BaseModel {
  id?: string;
  vendorId?: string;
  vendorServiceCodeId?: string;
}
