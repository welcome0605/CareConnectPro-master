import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  Input,
  EventEmitter,
  ViewChild
} from "@angular/core";
import {
  AuthService,
  NotificationsService,
  AlertService,
  ProgressSpinnerService,
  VendorService
} from "service-lib";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  EditHelperUserAction,
  EditHelperActionType,
  VendorBusinessService,
  UserSession
} from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "vendor-addstep3",
  templateUrl: "./vendor-addstep3.component.html"
})
export class OrgVendorAddStep3Component implements OnInit, OnChanges {
  activeVendorId: string;
  isLoading: boolean = false;
  tempService: string;
  errorMessage: string;
  activeCompanyId: string;
  isNewService: boolean = true;
  disableAddServiceBtn: boolean = true;
  disableDeleteServiceBtn: boolean = true;
  selectedVendorService: string;
  tempPractice: string;

  @Output() step3Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  isEditMode: boolean;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();

  imguser1: any;
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    private vendorService: VendorService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    if (this.isNewRecord === null) {
      this.isNewRecord = false;
    }
    if (this.isNewRecord === true) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.getVendorServices();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.updateStatus === true) {
      this.isEditMode = false;
    }
  }

  private onServiceSelect() {
    this.tempService = this.selectedVendorService;
    this.isNewService = false;
    this.disableDeleteServiceBtn = false;
    this.disableAddServiceBtn = false;
  }

  editEventSubmit(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode = true;
        break;
      }
      case 4:
      case 2: {
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode();
        this.vendorService.revertVendorData();
        break;
      }
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(["/home/personnel", "3"]);
  }

  submitForm() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    } else {
      this.getVendorServiceForDbOper();
    }
    this.step3Status.emit(userAction);
  }

  goToPrev() {
    this.goBack.emit(true);
  }

  private validateServiceInputText(event: any) {
    let x: any = event.target.value;
    //block the ability to add ore delete based on if the practice is null
    if (x == "") {
      switch (this.isNewService) {
        case true: {
          this.disableAddServiceBtn = true;
          break;
        }
        case false: {
          this.disableDeleteServiceBtn = true;
          this.isNewService = true;
          break;
        }
      }
    } else {
      switch (this.isNewService) {
        case true: {
          this.disableAddServiceBtn = false;
          break;
        }
      }
    }
  }

  deleteServiceFromDb() {
    if (this.isNewRecord) {
      this.deleteServiceFromListNoDb();
    } else {
      let businessService: VendorBusinessService;
      let x: any = this.vendorService.vendor.services.find(
        (x: any) => x.vendorServiceCodeId == this.selectedVendorService
      );
      if (x != undefined) {
        businessService = x;
      }
      let ret = this.vendorService
        .deleteVendorBusinessService(businessService)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: any = data;
            this.getServiceFromDb();
            this.notifyService.notify(
              "success",
              "Update Vendor",
              "Service deleted successfully"
            );
            this.spinnerService.hide();
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "create vendor failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "create vendor failed. Please contact Care Connect Pro service desk."
            );
            this.spinnerService.hide();
          }
        );
    }
  }

  //function to delete practice from list without calling Db
  private deleteServiceFromListNoDb() {
    let x: number;
    x = this.vendorService.vendorBusinessServicesSelect.findIndex(
      x => x.label == this.tempService
    );
    this.vendorService.vendorBusinessServicesSelect.splice(x, 1);
    this.clearTempServiceText();

    this.notifyService.notify(
      "success",
      "Update Vendor",
      "Service deleted successfully"
    );
  }

  private clearTempServiceText() {
    this.tempService = "";
    this.disableAddServiceBtn = true;
    this.disableDeleteServiceBtn = true;
    this.isNewService = true;
  }

  private getServiceFromDb() {
    if (!this.isNewRecord) {
      this.spinnerService.show();
      let ret = this.vendorService
        .getVendorBusinessService(this.vendorService.vendor.id)
        .finally((data: any) => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: VendorBusinessService[] = data;
            this.vendorService.vendor.services = [];
            this.vendorService.vendor.services = ret;
            this.populateVendorService();
            this.spinnerService.hide();
          },
          (error: any) => {
            this.spinnerService.hide();
            this.alertService.clear();
            this.alertService.error(
              "Unable to read vendor practices. Please contact Care Connect Pro service desk"
            );
            //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
          }
        );
    }
  }

  private saveService() {
    if (this.isValidServiceName()) {
      if (this.isNewRecord) {
        this.addToServiceList(this.tempService);
      } else {
        if (this.isNewService) {
          this.addServiceFromDb();
        } else {
          this.updateServiceFromDb();
        }
      }
    } else {
      this.alertService.clear();
      this.alertService.error(
        "Service name already exist in list. Please enter a different name."
      );
    }
  }

  private addServiceFromDb() {
    if (!this.isNewService) {
      this.updateServiceFromDb();
    } else {
      let businessService: VendorBusinessService;
      businessService.vendorServiceCodeId = this.tempService;
      businessService.vendorId = this.vendorService.vendor.id;
      let ret = this.vendorService
        .addVendorBusinessService(businessService)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: any = data;
            this.getServiceFromDb();
            this.notifyService.notify(
              "success",
              "Update Vendor",
              "Service updated successfully"
            );
            this.spinnerService.hide();
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "create vendor failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "create vendor failed. Please contact Care Connect Pro service desk."
            );
            this.spinnerService.hide();
          }
        );
    }
  }

  private updateServiceFromDb() {
    if (this.isNewRecord) {
      this.updateServiceListNoDb();
    } else {
      let businessService: any = this.vendorService.vendor.services.find(
        (x: any) => x.vendorServiceCodeId == this.selectedVendorService
      );
      if (businessService != undefined) {
        businessService.vendorServiceCodeId = this.tempService;
      }
      let ret = this.vendorService
        .updateVendorBusinessService(businessService)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: any = data;
            this.getServiceFromDb();
            this.notifyService.notify(
              "success",
              "Update Vendor",
              "Service updated successfully"
            );
            this.spinnerService.hide();
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "create vendor failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "create vendor failed. Please contact Care Connect Pro service desk."
            );
            this.spinnerService.hide();
          }
        );
    }
  }

  private updateServiceListNoDb() {
    let x: number = this.vendorService.vendorBusinessServicesSelect.findIndex(
      x => x.label == this.selectedVendorService
    );
    if (x == 0 || x > 0) {
      this.vendorService.vendorBusinessServicesSelect[
        x
      ].label = this.tempService;
      this.vendorService.vendorBusinessServicesSelect[
        x
      ].value = this.tempService;
    }
    this.notifyService.notify(
      "success",
      "Update Vendor",
      "Service updated successfully"
    );
  }

  private getVendorServiceForDbOper() {
    let vendorservices: VendorBusinessService[] = [];
    if (!this.vendorService.vendorBusinessServicesSelect) {
      this.vendorService.vendorBusinessServicesSelect = [];
    }
    this.vendorService.vendorBusinessServicesSelect.forEach(item => {
      let x: VendorBusinessService;
      x.vendorServiceCodeId = item.value;
      x.vendorId = this.vendorService.vendor.id;
      vendorservices.push(x);
    });
    this.vendorService.vendor.services = vendorservices;
  }

  private addToServiceList(vendorservice: string) {
    if (!this.vendorService.vendorBusinessServicesSelect) {
      this.vendorService.vendorBusinessServicesSelect = [];
    }
    this.vendorService.vendorBusinessServicesSelect.push({
      value: vendorservice,
      label: vendorservice
    });
    this.clearTempServiceText();

    if (this.isNewService) {
      this.notifyService.notify(
        "success",
        "Update Vendor",
        "Service added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Vendor",
        "Service updated successfully"
      );
    }
  }

  private isValidServiceName(): boolean {
    let ret: boolean = false;

    if (!this.isNewRecord) {
      if (!this.vendorService.vendor.services) {
        this.vendorService.vendor.services = [];
      }
      let x: any = this.vendorService.vendor.services.find(
        (x: any) => x.vendorServiceCodeId == this.tempService
      );
      if (x != undefined) {
        ret = false;
      } else {
        ret = true;
      }
    } else {
      if (!this.vendorService.vendorBusinessServicesSelect) {
        this.vendorService.vendorBusinessServicesSelect = [];
      }
      let x: any = this.vendorService.vendorBusinessServicesSelect.find(
        x => x.label == this.tempService
      );
      if (x) {
        ret = false;
      } else {
        ret = true;
      }
    }
    return ret;
  }

  private populateVendorService() {
    this.isNewService = true;
    if (this.vendorService.vendor.services) {
      this.vendorService.vendorBusinessServicesSelect = [];
      this.vendorService.vendor.services.forEach(businessService => {
        if (businessService.vendorServiceCodeId) {
          this.vendorService.vendorBusinessServicesSelect.push({
            label: businessService.vendorServiceCodeId,
            value: businessService.vendorServiceCodeId
          });
        }
      });
    }
  }

  private getVendorServices() {
    let ret = this.vendorService
      .getVendorBusinessService(this.vendorService.vendor.id)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          if (data != null) {
            this.vendorService.vendor.services = data;
            this.populateVendorService();
          }
          this.spinnerService.hide();
        },
        (error: any) => {
          console.log(
            "vendor detail - unable to retrieve vendor services. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }
}
