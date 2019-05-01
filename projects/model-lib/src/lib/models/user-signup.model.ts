export interface UserSignup {
  firstname?: string;
  lastname?: string;
  useremail?: string;
  userphone?: string;
  company?: string;
  jobtitle?: string;
  username?: string;
  password1?: string;
  password2?: string;
  subscriptionid?: string;
}

export interface SignupResponse {
  userId?: string;
  companyId?: string;
  message?: string;
  rowsAffected?: number;
}
