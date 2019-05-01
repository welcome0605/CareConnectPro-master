import { Injectable } from "@angular/core";
import { SubscriptionPackage } from "model-lib";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SubscriptionService {
  private subscriptionPackages: SubscriptionPackage[] = [];

  getAllSubscriptionPackages() {
    return this.subscriptionPackages;
  }

  getSubscriptionPackageById(value: string) {
    return this.subscriptionPackages;
  }
}
