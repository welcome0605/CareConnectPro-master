import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  AlertService,
  ProgressSpinnerService,
  VendorService
} from "service-lib";
import { Router } from "@angular/router";
import {
  EditHelperUserAction,
  EditHelperActionType,
  IdentityAppUser,
  AppUserTypeCodes,
  VendorBusinessService,
  TaskList,
  WorkflowProcess,
  UserSession,
  Vendor
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "vendor-addmain",
  templateUrl: "./vendor-addmain.component.html"
})
export class OrgVendorAddMainComponent implements OnInit {
  workflowTasks: TaskList[] = [];
  workflowClass1: string = "col-md-4";
  workflowClass2: string = "col-md-8";
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;
  identityAppUser: IdentityAppUser = {};
  isLoading: boolean = false;
  errorMessage: string;
  activeCompanyId: string;
  workflowstep: number = 1;
  vendorServicesSelect: SelectItem[];
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private vendorService: VendorService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.getWorkflowTasks();
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.vendorService.vendor.isActive = true;
  }

  handleStep1(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[0].isCompleted = true;
      this.workflowstep = 2;
    }
  }
  handleStep2(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[1].isCompleted = true;
      this.workflowstep = 3;
    }
  }
  handleStep3(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[2].isCompleted = true;
      this.workflowstep = 4;
    }
  }
  handleStep4(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[3].isCompleted = true;
      this.addVendor();
    }
  }

  goBack(event: any) {
    if (event === true) {
      this.workflowTasks[this.workflowstep - 1].isCompleted = false;
      this.workflowTasks[this.workflowstep - 2].isCompleted = false;
      this.workflowstep = this.workflowstep - 1;
    }
  }

  getWorkflowTasks() {
    this.workflowTasks = [];
    this.workflowTasks.push({
      id: 1,
      description: "Enter Demographics Information",
      processName: WorkflowProcess.AddVendor,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 2,
      description: "Enter Contact Information",
      processName: WorkflowProcess.AddVendor,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 3,
      description: "Services Offered",
      processName: WorkflowProcess.AddVendor,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 4,
      description: "Enter Profile Settings",
      processName: WorkflowProcess.AddVendor,
      isCompleted: false
    });
  }

  redrawTemplate(event: any) {
    const val: string = event;
    const valArray: string[] = val.split("-");
    switch (valArray[0]) {
      case "left": {
        if (valArray[1] === "0") {
          this.workflowClass1 = "col-md-4 ho2-workflow-helper-left";
          this.workflowClass2 = "col-md-10";
        } else {
          this.workflowClass1 = "col-md-4";
          this.workflowClass2 = "col-md-8";
        }
        break;
      }
      default: {
        this.workflowClass1 = "col-md-4";
        this.workflowClass2 = "col-md-8";
        break;
      }
    }
  }

  cancel() {
    this.vendorService.vendor = {};
    this.router.navigate(["/home/personnel"]);
  }

  private addVendor() {
    this.populateVendorService();
    this.vendorService.vendor.companyId = this.activeCompanyId;
    this.vendorService.vendor.isActive = true;
    this.spinnerService.show();
    this.getVendorServicesForDbOper();
    let ret = this.vendorService
      .addVendor(this.vendorService.vendor)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let ret: Vendor = data;
          this.vendorService.vendor = ret;
          //vendors.push(ret);
          this.saveVendorUpdateDT();
          this.spinnerService.hide();
        },
        error => {
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
    this.cancel();
  }

  private getVendorServicesForDbOper() {
    let services: VendorBusinessService[] = [];
    this.vendorService.vendorBusinessServicesSelect.forEach(item => {
      let x: VendorBusinessService;
      x.vendorServiceCodeId = item.value;
      x.vendorId = this.vendorService.vendor.id;
      services.push(x);
    });
    this.vendorService.vendor.services = services;
  }

  private populateVendorService() {
    this.vendorService.isNewService = true;
    if (this.vendorService.vendor.services) {
      this.vendorServicesSelect = [];
      this.vendorService.vendor.services.forEach(busService => {
        if (busService.vendorServiceCodeId) {
          this.vendorServicesSelect.push({
            label: busService.vendorServiceCodeId,
            value: busService.vendorServiceCodeId
          });
        }
      });
    }
  }
}
