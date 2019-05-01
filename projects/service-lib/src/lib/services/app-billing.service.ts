import { Injectable } from "@angular/core";
import {
  SubscriptionPkgDesc,
  SubscriptionPkgPrice,
  SubscriptionTypes,
  UserPaymentInfo
} from "model-lib";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BillingService {
  tempSubPkgDesc: SubscriptionPkgDesc[] = [
    { id: 1001, pkgPriceId: 2001, description: "$499 (2 users license)" },
    { id: 1002, pkgPriceId: 2002, description: "$999  (5 users license)" },
    { id: 1003, pkgPriceId: 2003, description: "$4999 (25 users license)" },
    { id: 1004, pkgPriceId: 2004, description: "$9999 (100 users license)" }
  ];

  tempSubPkgPrice: SubscriptionPkgPrice[] = [
    { id: 2001, amount: 499.0 },
    { id: 2002, amount: 999.0 },
    { id: 2003, amount: 4999.0 },
    { id: 2004, amount: 9999.0 }
  ];

  tempSubTypes: SubscriptionTypes[] = [
    { id: 11, description: "Free Trial" },
    { id: 12, description: "Monthly" }
  ];

  freeSubscriptionId: string = "T16DD-YHDSSS-XSSAS-RUISS-YQWAN";
  monthlySubscriptionId: string = "M923S-GWMLSS-WKJNK-PQKJSN-DJKSQ";

  getSubscriptionPkgDesc() {
    return this.tempSubPkgDesc;
  }

  getSubscriptionPkgPrice() {
    return this.tempSubPkgPrice;
  }

  getSubscriptionTypes() {
    return this.tempSubTypes;
  }

  processPayment(responsePay: UserPaymentInfo) {
    responsePay.approvalcode = "A649960002";
    responsePay.paymentstatus = "Approved";

    return responsePay;
  }

  getSubscriptionTypeById(sel: number) {
    let qry: any = this.tempSubTypes.find(i => i.id === sel);
    if (qry != undefined) {
      return qry.description;
    } else {
      return "";
    }
  }

  getSubscriptionTrialId() {
    return this.freeSubscriptionId;
  }

  getSubscriptionPaidId() {
    return this.monthlySubscriptionId;
  }

  getPkgPrice(sel: number) {
    let res: any = this.tempSubPkgPrice.find(i => i.id == sel);
    if (res != undefined) {
      return res.amount;
    } else {
      return 0;
    }
  }
}
