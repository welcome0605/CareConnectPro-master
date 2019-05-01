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
  CodesService
} from "service-lib";
import { Router } from "@angular/router";
import {
  EditHelperUserAction,
  EditHelperActionType,
  EmployeeSummary,
  UserSession
} from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "employee-detail",
  templateUrl: "./employee-detail.component.html"
})
export class OrgEmployeeDetailComponent implements OnInit {
  saveStatus1: boolean = false;
  saveStatus2: boolean = false;
  saveStatus3: boolean = false;
  saveStatus4: boolean = false;
  isLoading: boolean = false;
  activeCompanyId: string = "";
  states: any[];

  imguser1: any;
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    public employeeService: EmployeeService,
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
    this.employeeService.departments = [];
    this.employeeService.allEmployees = [];
    this.employeeService.appRoles = [];
    this.employeeService.appUserTypes = [];
    this.employeeService.prefixCodes = [];
    this.employeeService.suffixCodes = [];
  }

  handleStep1(event: EditHelperUserAction) {
    this.saveStatus1 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus1 = true;
        this.updateEmployee();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus1 = true;
        this.deleteEmployee();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus1 = true;
        this.activateEmployee();
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
        this.updateEmployee();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus2 = true;
        this.deleteEmployee();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus2 = true;
        this.activateEmployee();
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
        this.updateEmployee();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus3 = true;
        this.deleteEmployee();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus3 = true;
        this.activateEmployee();
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
        this.updateEmployee();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus4 = true;
        this.deleteEmployee();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus4 = true;
        this.activateEmployee();
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

  private updateEmployee() {
    this.spinnerService.show();
    let ret = this.employeeService
      .updateEmployee(this.employeeService.employee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let x: any = data;
          this.saveEmployeeUpdateDT();
        },
        error => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  saveEmployeeUpdateDT() {
    if (this.employeeService.isNewEmployee) {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Employee added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Employee updated successfully"
      );
    }
  }

  activateEmployee() {
    this.employeeService.employee.isActive = true;
    this.spinnerService.show();
    let ret = this.employeeService
      .updateEmployee(this.employeeService.employee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: EmployeeSummary = data;
          this.saveEmployeeUpdateDT();
          this.notifyService.notify(
            "success",
            "Update Personnel",
            "Employee deleted successfully"
          );
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  deleteEmployee() {
    this.spinnerService.show();
    this.employeeService.employee.isActive = false;
    this.employeeService.employee.dateTerminated = new Date();
    let ret = this.employeeService
      .updateEmployee(this.employeeService.employee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: EmployeeSummary = data;
          this.saveEmployeeUpdateDT();
          this.notifyService.notify(
            "success",
            "Update Personnel",
            "Employee DeActivated successfully"
          );
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }
}
