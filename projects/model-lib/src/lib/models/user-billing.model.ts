import { CreditCardType } from "../enums";
import { BaseAddress } from "./base.model";

export interface UserBillingInfo extends BaseAddress {
  firstname?: string;
  lastname?: string;
}

export interface UserPaymentInfo {
  cardtype?: CreditCardType;
  cardnumber?: string;
  expyear?: number;
  expmonth?: number;
  paymentstatus?: string;
  storecard?: boolean;
  totamount?: number;
  totmonths?: number;
  approvalcode?: string;
  cardcvv?: number;
}
