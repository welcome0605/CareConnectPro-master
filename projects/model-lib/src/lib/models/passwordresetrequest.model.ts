export interface PasswordResetRequest {
  id?: string;
  normalizedId?: number;
  username?: string;
  token?: string;
  isActive?: boolean;
  dateCreated?: Date;
}
