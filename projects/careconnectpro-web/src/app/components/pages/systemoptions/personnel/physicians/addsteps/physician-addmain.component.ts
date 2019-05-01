import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  CompanyService,
  SecurityService,
  AlertService,
  ProgressSpinnerService,
  PhysicianService
} from "service-lib";
import { Router } from "@angular/router";
import {
  EditHelperUserAction,
  EditHelperActionType,
  IdentityAppUser,
  AppUserTypeCodes,
  TaskList,
  WorkflowProcess,
  UserSession,
  Physician,
  PhysicianPracticeArea
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "physician-addmain",
  templateUrl: "./physician-addmain.component.html"
})
export class OrgPhysicianAddMainComponent implements OnInit {
  workflowTasks: TaskList[] = [];
  workflowClass1: string = "col-md-4";
  workflowClass2: string = "col-md-8";
  activeEmployeeId: string;
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;
  identityAppUser: IdentityAppUser;
  dateHired: any;
  dateTerminated: any;
  dateOfBirth: any;
  isLoading: boolean = false;
  errorMessage: string;
  activeCompanyId: string;
  workflowstep: number = 1;
  physicianPracticesSelect: SelectItem[];
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private physicianService: PhysicianService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.getWorkflowTasks();
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.physicianService.physician.isActive = true;
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
      this.addPhysician();
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
      processName: WorkflowProcess.AddPhysician,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 2,
      description: "Enter Contact Information",
      processName: WorkflowProcess.AddPhysician,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 3,
      description: "Practice Area",
      processName: WorkflowProcess.AddPhysician,
      isCompleted: false
    });
    this.workflowTasks.push({
      id: 4,
      description: "Enter Profile Settings",
      processName: WorkflowProcess.AddPhysician,
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
    this.physicianService.physician = {};
    this.router.navigate(["/home/personnel"]);
  }

  private addPhysician() {
    this.populatePhysicianPractice();
    this.physicianService.physician.companyId = this.activeCompanyId;
    this.physicianService.physician.isActive = true;
    this.spinnerService.show();
    this.getPhysicianPracticeForDbOper();
    let ret = this.physicianService
      .addPhysician(this.physicianService.physician)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let ret: Physician = data;
          this.physicianService.physician = ret;
          this.savePhysicianUpdateDT();
          this.spinnerService.hide();
        },
        error => {
          this.alertService.clear();
          this.alertService.error(
            "create physician failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "create physician failed. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }

  private savePhysicianUpdateDT() {
    if (this.physicianService.isNewPhysician) {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Physician added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Physician updated successfully"
      );
    }
    this.cancel();
  }

  private getPhysicianPracticeForDbOper() {
    let practices: PhysicianPracticeArea[] = [];
    this.physicianService.physicianPracticesSelect.forEach(item => {
      let x: PhysicianPracticeArea;
      x.practiceCodeId = item.value;
      x.physicianId = this.physicianService.physician.id;
      practices.push(x);
    });
    this.physicianService.physician.practices = practices;
  }

  private populatePhysicianPractice() {
    this.physicianService.isNewPractice = true;
    if (this.physicianService.physician.practices) {
      this.physicianPracticesSelect = [];
      this.physicianService.physician.practices.forEach(practice => {
        if (practice.practiceCodeId) {
          this.physicianPracticesSelect.push({
            label: practice.practiceCodeId,
            value: practice.practiceCodeId
          });
        }
      });
    }
  }
}
