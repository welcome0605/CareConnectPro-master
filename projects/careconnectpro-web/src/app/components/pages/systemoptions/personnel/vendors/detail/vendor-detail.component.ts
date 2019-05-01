import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  EmployeeService,
  CompanyService,
  SecurityService,
  AlertService,
  ProgressSpinnerService,
  MediaService,
  CodesService,
  VendorService
} from "service-lib";
import { Router } from "@angular/router";
import {
  EditHelperUserAction,
  EditHelperActionType,
  UserSession,
  Vendor
} from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "vendor-detail",
  templateUrl: "./vendor-detail.component.html"
})
export class OrgVendorDetailComponent implements OnInit {
  saveStatus1: boolean = false;
  saveStatus2: boolean = false;
  saveStatus3: boolean = false;
  saveStatus4: boolean = false;
  isLoading: boolean = false;
  activeCompanyId: string;
  states: any[];

  imguser1: any;
  userSession: UserSession;

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private vendorService: VendorService,
    private alertService: AlertService,
    private mediaService: MediaService,
    private spinnerService: ProgressSpinnerService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
  }

  initValues() {
    this.vendorService.allvendors = [];
  }

  handleStep1(event: EditHelperUserAction) {
    this.saveStatus1 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus1 = true;
        this.updateVendor();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus1 = true;
        this.deleteVendor();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus1 = true;
        this.activateVendor();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }
  handleStep2(event: any) {
    this.saveStatus2 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus2 = true;
        this.updateVendor();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus2 = true;
        this.deleteVendor();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus2 = true;
        this.activateVendor();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }
  handleStep3(event: any) {
    this.saveStatus3 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus3 = true;
        this.updateVendor();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus3 = true;
        this.deleteVendor();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus3 = true;
        this.activateVendor();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }
  handleStep4(event: any) {
    this.saveStatus4 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus4 = true;
        this.updateVendor();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus4 = true;
        this.deleteVendor();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus4 = true;
        this.activateVendor();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }

  private updateVendor() {
    this.spinnerService.show();
    let ret = this.vendorService
      .updateVendor(this.vendorService.vendor)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let x: any = data;
          this.saveVendorUpdateDT();
          this.spinnerService.hide();
        },
        error => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }

  private activateVendor() {
    this.vendorService.vendor.isActive = true;
    this.spinnerService.show();
    let ret = this.vendorService
      .updateVendor(this.vendorService.vendor)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Vendor = data;
          this.notifyService.notify(
            "success",
            "Update Personnel",
            "Vendor ReActivated successfully"
          );
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }

  private deleteVendor() {
    this.spinnerService.show();
    this.vendorService.vendor.isActive = false;
    let ret = this.vendorService
      .updateVendor(this.vendorService.vendor)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Vendor = data;
          this.notifyService.notify(
            "success",
            "Update Personnel",
            "Vendor DeActivated successfully"
          );
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }

  private saveVendorUpdateDT() {
    if (this.vendorService.isNewVendor) {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Vendor added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Vendor updated successfully"
      );
    }
  }
}
