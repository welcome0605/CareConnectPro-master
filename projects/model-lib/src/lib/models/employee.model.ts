import { BaseAddress, BaseModel } from "./base.model";
import { People } from "./peopleplace.model";

export interface Employee extends People {
  id?: string;
  normalizedEmployeeId?: number;
  companyId?: string;
  departmentId?: string;
  roleId?: string;
  loginId?: string;
  prefix?: string;
  firstName?: string;
  lastName?: string;
  suffix?: string;
  dateOfBirth?: Date;
  gender?: string;
  salary?: number;
  salaryType?: string;
  codeId?: string;
  reportToId?: string;
  jobTitle?: string;
  dateHired?: Date;
  dateTerminated?: Date;
  isActive?: boolean;
}

export interface EmployeeAddress extends BaseAddress, BaseModel {
  id?: string;
  employeeId?: string;
  isActive?: boolean;
  isPrimary?: boolean;
}

export interface EmployeeProfile extends BaseModel {
  id?: string;
  employeeId?: string;
  defaultTheme?: string;
  biography?: string;
  photoName?: string;
  photo?: string;
}

export interface EmployeeSummary extends BaseAddress {
  employeeId?: string;
  normalizedEmployeeId?: number;
  companyId?: string;
  departmentId?: string;
  roleId?: string;
  prefix?: string;
  firstName?: string;
  lastName?: string;
  suffix?: string;
  dateOfBirth?: Date;
  gender?: string;
  evvId?: string;
  ssn?: string;
  salary?: number;
  salaryType?: string;
  codeId?: string;
  reportToId?: string;
  jobTitle?: string;
  dateHired?: Date;
  dateTerminated?: Date;
  employeeAddressId?: string;
  employeeProfileId?: string;
  defaultTheme?: string;
  biography?: string;
  photoName?: string;
  photo?: string;
  identityAppUserId?: string;
  userName?: string;
  userTypeId?: string;
  email?: string;
  phoneNumber?: string;
  isSysAdmin?: boolean;
  isActive?: boolean;
  password?: string;
  lastUpdatedUserId?: string;
  isPasswordChange?: boolean;
}

export interface EmployeeName {
  id?: string;
  name?: string;
  companyId?: string;
  photoName?: string;
}
