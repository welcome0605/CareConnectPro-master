import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  EmployeeService,
  AlertService,
  ProgressSpinnerService
} from "service-lib";
import { Router } from "@angular/router";
import {
  EditHelperUserAction,
  EditHelperActionType,
  IdentityAppUser,
  EmployeeSummary,
  AppUserTypeCodes,
  TaskList,
  WorkflowProcess,
  UserSession
} from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "employee-addmain",
  templateUrl: "./employee-addmain.component.html"
})
export class OrgEmployeeAddMainComponent implements OnInit {
  workflowTasks: TaskList[] = [];
  workflowClass1: string = "col-md-4";
  workflowClass2: string = "col-md-8";
  activeEmployeeId: string;
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;
  identityAppUser: IdentityAppUser = {};
  dateHired: any;
  dateTerminated: any;
  dateOfBirth: any;
  isLoading: boolean = false;
  errorMessage: string;
  activeCompanyId: string;
  workflowstep: number = 1;
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    public employeeService: EmployeeService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.getWorkflowTasks();
    this.activeCompanyId = this.userSession.companyId;
    this.apphtmlcontrol.enableThemeSwitcher();
    this.employeeService.employee.isActive = true;
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
      this.addEmployee();
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
      processName: WorkflowProcess.AddEmployee,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 2,
      description: "Enter Contact Information",
      processName: WorkflowProcess.AddEmployee,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 3,
      description: "Create Login Information",
      processName: WorkflowProcess.AddEmployee,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 4,
      description: "Enter Profile Settings",
      processName: WorkflowProcess.AddEmployee,
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
    this.employeeService.employee = {};
    //this.employeeService.displayDialogEmployee = false;
    this.router.navigate(["/home/personnel"]);
  }

  private addEmployee() {
    this.employeeService.employee.companyId = this.activeCompanyId;
    this.employeeService.employee.isActive = true;
    this.employeeService.employee.userTypeId = this.appUserTypeCode;
    this.employeeService.employee.dateTerminated = this.employeeService.dateTerminated;
    this.employeeService.employee.dateHired = this.employeeService.dateHired;
    this.employeeService.employee.dateOfBirth = this.employeeService.dateOfBirth;
    this.spinnerService.show();
    let ret = this.employeeService
      .addEmployeeSummary(this.employeeService.employee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let ret: EmployeeSummary = data;
          this.employeeService.employee = ret;
          this.displaySavedMessage();
        },
        error => {
          this.alertService.clear();
          this.alertService.error(
            "create employee failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "create employee failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  displaySavedMessage() {
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
    this.cancel();
  }
}
