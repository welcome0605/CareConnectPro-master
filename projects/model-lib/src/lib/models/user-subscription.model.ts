export interface SubscriptionBase {
  subscriptionId?: string;
  subType?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface SubscriptionPkgDesc {
  id?: number;
  pkgPriceId?: number;
  description?: string;
}

export interface SubscriptionPkgPrice {
  id?: number;
  amount?: number;
}

export interface SubscriptionTypes {
  id?: number;
  description?: string;
}
