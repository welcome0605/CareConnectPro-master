import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  CompanyService,
  NotificationsService,
  CareConnectLocalStorage,
  ProgressSpinnerService,
  PatientInTakeService,
  DataService,
  AuthService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  EditHelperActionType,
  EditHelperUserAction,
  Patient,
  APIUrls,
  Message,
  UserSession
} from "model-lib";
import { BaseComponent } from "../../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-details",
  templateUrl: "./patient-details.component.html"
})
export class PatientDetailsComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;

  saveStatus1: boolean = false;
  saveStatus2: boolean = false;
  saveStatus3: boolean = false;
  saveStatus4: boolean = false;
  saveStatus5: boolean = false;
  saveStatus6: boolean = false;
  saveStatus7: boolean = false;

  companySubscriptions = this.companyService.companySubscriptions;
  rootNode: any;
  activeCompanyId: string;
  patient: Patient = {};
  userSession: UserSession = {};
  activeLocId: string = "";

  constructor(
    public companyService: CompanyService,
    public localStore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    private notifyService: NotificationsService,
    private intakeService: PatientInTakeService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    super();
    this.title = "User Profile";
    this.spinnerService.setMessage("Loading user profile page...");
    this.spinnerService.show();
  }

  ngOnInit() {
    this.displayUserProfile = true;
    this.displayUserSetting = false;
    this.displayUserAlerts = false;
    this.getLoggedInUserInfo();
    this.getPatient();
  }

  /**
   * Method - To retrieve patient data from service
   */
  getPatient() {
    let patient: Patient = {};
    this.patient = this.intakeService.getPatient();
    this.spinnerService.show();
    let ret = this.dataService
      .getSingleData(patient, this.patient.id, APIUrls.Patient)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: Patient = data;
          if (ret != undefined) {
            this.patient = ret;
            this.patient.lastUpdatedUserId = this.userSession.employeeId;
            this.patient.lastUpdatedDate = new Date();
            this.intakeService.updatePatient(this.patient);
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.ErrorGetDatabaseRecordFailed +
              " patient id:" +
              this.patient.id
          );
        }
      );
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
        this.getPatient();
      });

    //subscribe to observable - changed location
    this.authService.activeLocationId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.activeLocId = data;
      });
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  handleStep1(event: EditHelperUserAction) {
    this.saveStatus1 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus1 = true;
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus1 = true;
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus1 = true;
        this.activatePatient();
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

  handleStep2(event: EditHelperUserAction) {
    this.saveStatus2 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus2 = true;
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus2 = true;
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus2 = true;
        this.activatePatient();
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

  handleStep3(event: EditHelperUserAction) {
    this.saveStatus3 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus3 = true;
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus3 = true;
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus3 = true;
        this.activatePatient();
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

  handleStep4(event: EditHelperUserAction) {
    this.saveStatus4 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus4 = true;
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus4 = true;
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus4 = true;
        this.activatePatient();
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

  handleStep5(event: EditHelperUserAction) {
    this.saveStatus5 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus5 = true;
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus5 = true;
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus5 = true;
        this.activatePatient();
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

  handleStep6(event: EditHelperUserAction) {
    this.saveStatus6 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus6 = true;
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus6 = true;
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus6 = true;
        this.activatePatient();
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

  handleStep7(event: EditHelperUserAction) {
    this.saveStatus7 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus7 = true;
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus7 = true;
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus7 = true;
        this.activatePatient();
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

  /**
   * Method - Update main patient record in database
   */
  updatePatient() {
    let patient: Patient = {};
    this.patient = this.intakeService.getPatient();
    this.spinnerService.show();
    let ret = this.dataService
      .updateData(patient, APIUrls.Patient)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: Patient = data;
          if (ret != undefined) {
            this.displaySuccessConfirmation();
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.ErrorUpdateDatabaseRecordFailed +
              " patient id:" +
              this.patient.id
          );
        }
      );
  }

  /**
   * Method - Display confirmation
   */
  displaySuccessConfirmation() {
    this.notifyService.notify("success", "Update Record", "Successfull");
  }

  updatePatientAddress() {
    //todo
  }

  updatePatientRelative() {
    //todo
  }

  updateReferringDoctor() {
    //todo
  }

  updateEmployer() {
    //todo
  }

  updateInsurance() {
    //todo
  }

  updateDoctorsOrders() {
    //todo
  }

  deActivatePatient() {
    //todo
  }

  activatePatient() {
    //todo
  }
}
