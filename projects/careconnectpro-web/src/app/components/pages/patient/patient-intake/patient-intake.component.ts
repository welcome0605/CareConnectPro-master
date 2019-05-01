import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  PatientInTakeService,
  NotificationsService,
  CareConnectLocalStorage,
  ProgressSpinnerService,
  CodesService,
  DataService,
  SecurityService,
  AuthService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  TaskList,
  EditHelperUserAction,
  EditHelperActionType,
  Patient,
  APIUrls,
  Message,
  UserSession
} from "model-lib";
import { Router, NavigationExtras } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../../shared/core";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake",
  templateUrl: "./patient-intake.component.html"
})
export class PatientInTakeComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  title: string;
  subtitle: string;
  activeCompanyId: string;
  workflowTasks: TaskList[] = [];
  workflowstep: number = 1;
  workflowClass1: string = "col-md-4";
  workflowClass2: string = "col-md-8";
  medPgmGuid: string = "";
  patient: Patient = {};
  userSession: UserSession = {};
  activeLocId: string = "";
  private billingPreferenceId: string = "323244-43JSJHHS";

  constructor(
    public intakeService: PatientInTakeService,
    public localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    private notifyService: NotificationsService,
    private codesService: CodesService,
    private dataService: DataService,
    public router: Router,
    public securityService: SecurityService,
    private authService: AuthService
  ) {
    super();
    this.title = "Patient InTake";
    this.spinnerService.setMessage("Loading Patient InTake...");
    this.spinnerService.show();
  }

  /**
   * Method - Life cycle hook - initialize component
   */
  ngOnInit() {
    this.codesService.initCodes();
    this.getIntakeTaskLists();
    this.getGuids();
    this.userSession = this.authService.getUserLoggedIn();
    //subscribe to logged in user observable
    this.getLoggedInUserInfo();
    this.initNewPatientObject();
  }

  /**
   * Method - Get Guids for Patient Id
   */
  getGuids() {
    this.securityService
      .getNewGuid()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.patient.id = data;
        this.intakeService.updatePatient(this.patient);
      });
  }

  /**
   * Method - Get logged in user data
   */
  getLoggedInUserInfo() {
    this.activeLocId = this.authService.getActiveAgencyLocationId();

    this.authService.userSessionSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.userSession = data;
        this.initNewPatientObject();
      });

    //subscribe to observable - changed location
    this.authService.activeLocationId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.activeLocId = data;
      });
  }

  /**
   * Method - Init new patient record
   */
  initNewPatientObject() {
    this.patient.lastUpdatedUserId = this.userSession.employeeId;
    this.patient.companyId = this.userSession.companyId;
    this.patient.dateCreated = new Date();
    this.patient.lastUpdatedDate = new Date();
    this.patient.isActive = true;
    this.patient.primaryLocationId = this.activeLocId;
    this.intakeService.updatePatient(this.patient);
  }

  /**
   * Method - Refresh the active location id
   */
  updateLocationId() {
    this.activeLocId = this.authService.getActiveAgencyLocationId();
  }

  /**
   * Method - Life cycle hook - after view init
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Retrieve intake workflow list
   */
  getIntakeTaskLists() {
    this.workflowTasks = this.intakeService.getIntakeTaskLists();
  }

  /**
   * Method - Go back
   * @param event
   */
  goBack(event: any) {
    if (event === true) {
      this.workflowTasks[this.workflowstep - 1].isCompleted = false;
      this.workflowTasks[this.workflowstep - 2].isCompleted = false;
      this.workflowstep = this.workflowstep - 1;
    }
  }

  /**
   * Method - Retrieve patient from service
   */
  getPatient() {
    this.patient = this.intakeService.getPatient();
  }

  /**
   * Method - Update patient record
   */
  updatePatient() {
    this.intakeService.updatePatient(this.patient);
  }
  /**
   * Method - Handle and validate intake workflow step 1
   * @param event
   */
  handleStep1(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[0].isCompleted = true;
      this.workflowstep = 2;
    }
  }

  /**
   * Method - Handle and validate intake workflow step 2
   * @param event
   */
  handleStep2(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[1].isCompleted = true;
      this.workflowstep = 3;
    }
  }
  /**
   * Method - Handle and validate intake workflow step 3
   * @param event
   */
  handleStep3(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[2].isCompleted = true;
      this.workflowstep = 4;
    }
  }

  /**
   * Method - Handle and validate intake workflow step 4
   * @param event
   */
  handleStep4(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[3].isCompleted = true;
      this.workflowstep = 5;
    }
  }

  /**
   * Method -  Handle and validate intake workflow step 5
   * @param event
   */
  handleStep5(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[4].isCompleted = true;
      this.workflowstep = 6;
    }
  }

  /**
   * Method - Handle and validate intake workflow step 6
   * @param event
   */
  handleStep6(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[5].isCompleted = true;
      this.workflowstep = 7;
    }
  }
  /**
   * Method - Handle and validate intake workflow step 7
   * @param event
   */
  handleStep7(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[6].isCompleted = true;
      this.workflowstep = 8;
    }
  }

  /**
   * Method - Handle and validate intake workflow step 8
   * @param event
   */
  handleStep8(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[7].isCompleted = true;
      this.workflowstep = 9;
    }
  }

  /**
   * Method - Handle and validate intake workflow step 9
   * @param event
   */
  handleStep9(event: EditHelperUserAction) {
    if (
      event.isSuccess === true &&
      event.actionType === EditHelperActionType.add
    ) {
      this.workflowTasks[8].isCompleted = true;
      this.addPatient();
    }
  }

  /**
   * Method - Prepare intake and add to database
   */
  addPatient() {
    this.getPatient();
    this.patient.medPrograms = [];
    this.patient.medPrograms.push({
      id: "",
      programId: "Insurance"
    });
    this.addPatientDb();
  }

  /**
   * Method - Save patient intake to database
   */
  addPatientDb() {
    this.updateLocationId();
    this.patient.primaryLocationId = this.activeLocId;
    this.patient.billingPreferenceId = this.billingPreferenceId;
    this.updatePatient();
    this.spinnerService.show();
    let ret = this.dataService
      .postData(this.patient, APIUrls.Patient)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.displaySavedMessage();
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.PostPatientIntakeFailed
          );
        }
      );
  }

  /**
   * Method - Display save message
   */
  displaySavedMessage() {
    if (this.intakeService.getIsNewPatient()) {
      this.notifyService.notify(
        "success",
        "Patient InTake",
        "New patient record created successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Patient InTake",
        "Patient record updated successfully"
      );
    }
    this.cancel();
  }

  /**
   * Method - Cancel workflow
   */
  cancel() {
    this.patient = {};
    this.updatePatient();
    this.router.navigate(["/home/patient"]);
  }

  /**
   * Method - Refresh template data
   * @param event
   */
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
}
