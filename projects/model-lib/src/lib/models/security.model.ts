import { BaseModel } from "./base.model";

export interface AppRole extends BaseModel {
  id?: string;
  companyId?: string;
  name?: string;
  description?: string;
  isEnabled?: boolean;
  assignedUsers?: number;
  assignedPermissions?: number;
}

export interface AppRolePermission extends BaseModel {
  id?: string;
  roleId?: string;
  assetId?: string;
  viewAsset?: boolean;
  createAsset?: boolean;
  updateAsset?: boolean;
  deleteAsset?: boolean;
}
