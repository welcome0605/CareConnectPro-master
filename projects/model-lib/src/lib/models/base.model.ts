export interface BaseModel {
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUserId?: string;
}

export interface BaseAddress extends BaseModel {
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
