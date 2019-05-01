export interface User {
  id?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  jobTitle?: string;
  phoneNumber?: string;
  isEnabled?: boolean;
  isLockedOut?: boolean;
  roles?: string[];
}

export interface IdentityAppUser {
  id?: string;
  userName?: string;
  companyId?: string;
  userTypeId?: string;
  email?: string;
  phoneNumber?: string;
  isSysAdmin?: boolean;
  isEnabled?: boolean;
  passwordHash?: string;
}
