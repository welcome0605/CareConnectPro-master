export interface UserLogin {
  userName?: string;
  password?: string;
  resetPasswordEmail?: string;
  token?: string;
  rememberMe?: boolean;
}

export interface UserSession {
  companyId?: string;
  employeeId?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  sessionId?: string;
  isAuthenticated?: boolean;
  roleId?: string;
  errorMsg?: string;
  isSysAdmin?: boolean;
  userTypeId?: string;
  employeePhotoName?: string;
  companyLogoName?: string;
  theme?: string;
}

export interface ResetPassword {
  resetemail?: string;
}
