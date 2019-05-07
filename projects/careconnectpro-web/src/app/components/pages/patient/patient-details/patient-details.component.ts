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
  UserSession,
  Address
} from "model-lib";
import { BaseComponent } from "../../../shared/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';

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

  //saveStatus1: boolean = false;
  saveStatus1: Subject<boolean> = new Subject<boolean>();
  saveStatus2: Subject<boolean> = new Subject<boolean>();
  saveStatus3: Subject<boolean> = new Subject<boolean>();
  saveStatus4: Subject<boolean> = new Subject<boolean>();
  saveStatus5: Subject<boolean> = new Subject<boolean>();
  saveStatus6: Subject<boolean> = new Subject<boolean>();
  saveStatus9: Subject<boolean> = new Subject<boolean>();

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

  /**
   * Method - Handle update to patient record section of the view
   * @param event 
   */
  handleStep1(event: EditHelperUserAction) {    
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus1.next(true);
        this.updatePatient();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus1.next(true);
        this.deActivatePatient();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus1.next(true);
        this.updatePatient(); 
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
   *  Method - Handle update to patient address  section of the view
   * @param event 
   */
  handleStep2(event: EditHelperUserAction) {
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus2.next(true);
        this.updatePatientAddress();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus2.next(true);
        this.deletePatientAddress();
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
   *  Method - Handle update to patient relative section of the view
   * @param event 
   */
  handleStep3(event: EditHelperUserAction) {
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus3.next(true);
        this.updatePatientRelative();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus3.next(true);
        this.deletePatientRelative();
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
   *  Method - Handle update to patient referral doctor section of the view
   * @param event 
   */
  handleStep4(event: EditHelperUserAction) {
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus4.next(true);
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus4.next(true);
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
   *  Method - Handle update to patient employer section of the view
   * @param event 
   */
  handleStep5(event: EditHelperUserAction) {
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus5.next(true);
        this.updatePatientEmployer();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus5.next(true);
        this.deletePatientEmployer();
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
   *  Method - Handle update to patient insurance record section of the view
   * @param event 
   */
  handleStep6(event: EditHelperUserAction) {
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus6.next(true);
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus6.next(true);
        this.deActivatePatient();
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
   *  Method - Handle update to patient order and medication section
   * @param event 
   */
  handleStep9(event: EditHelperUserAction) {
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus9.next(true);
        this.updateDoctorsOrders();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus9.next(true);
        this.deleteDoctorsOrders();
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
   * Method - Display confirmation
   */
  displaySuccessConfirmation() {
    this.notifyService.notify("success", "Update Record", "Successfull");
  }

  /**
   * Method - Update main patient record in database
   */
  updatePatient() {
    let patient = this.intakeService.getPatient();
    //remove non-patient data to be sent to data service 
    patient = this.removeAllNonPatientData(patient);
    if (!!patient) {
      this.updateDbData(patient, APIUrls.Patient);
    }
  }

  /**
   * Method - DeActivate Patient record
   */
  deActivatePatient() {
    const patient = this.intakeService.getPatient();
    if (!!patient) {
      this.deleteDbData(patient, APIUrls.Patient);
    }
  }

  /**
   * Method - Update primary patient address only
   */
  updatePatientAddress() {
    const address = this.intakeService.getPatientPrimaryAddress();
    this.spinnerService.show();
    if (!!address) {
      address.lastUpdatedUserId = this.patient.lastUpdatedUserId;
      address.lastUpdatedDate = this.patient.lastUpdatedDate;
      this.updateDbData(address, APIUrls.PatientAddress);
    }
  }

  /**
   * Method - DeActivate Patient address
   */
  deletePatientAddress() {
    const address = this.intakeService.getPatientPrimaryAddress();
    this.spinnerService.show();
    if (!!address) {
      this.deleteDbData(address, APIUrls.PatientAddress);
    }
  }

  /**
   * Method - Update patient relative record only
   */
  updatePatientRelative() {
    const relative = this.intakeService.getPatientRelatives();
    if (!!relative) {
      this.updateDbData(relative[0], APIUrls.PatientRelative)
    }
  }

  /**
   * Method - DeActivate Patient Relative
   */
  deletePatientRelative() {
    const relative = this.intakeService.getPatientRelatives();
    if (!!relative) {
      this.deleteDbData(relative[0], APIUrls.PatientRelative)
    }
  }


  /**
   * Method - Update patient employer
   */
  updatePatientEmployer() {
    const employer = this.intakeService.getPatientEmployers();
    if (!!employer) {
      this.updateDbData(employer[0], APIUrls.PatientEmployer)
    }
  }

  /**
   * Method - DeActivate Patient Employer
   */
  deletePatientEmployer() {
    const employer = this.intakeService.getPatientEmployers();
    if (!!employer) {
      this.deleteDbData(employer[0], APIUrls.PatientEmployer)
    }
  }
  
  /**
   * Method - Remove supplemental patient data to reduce api call
   * @param patient 
   */
   removeAllNonPatientData(patient: Patient) {
    patient.insurance = [];
    patient.medications = [];
    patient.paymentTransactions = [];
    patient.referrals = [];
    patient.relatives = [];
    patient.paymentProfile = [];
    patient.payees = [];
    patient.employers = [];
    patient.medPrograms = [];
    patient.diagnosis = [];
    return patient;
   }

  /**
   * Method - Update patient diagnosis
   */
  updatePatientDiagnosis() {
    let patient = this.intakeService.getPatient();
    //remove non-patient data except diagnosis to be sent to data service    
    patient = this.removeAllNonPatientData(patient);
    patient.diagnosis = this.intakeService.getPatientHealthConditions();
    if (!!patient) {
      this.updateDbData(patient, APIUrls.Patient);
    }
  }

  /**
   * Method - DeActivate Patient Diagnosis
   */
  deletePatientDiagnosis() {
    const diagnosis = this.intakeService.getPatientHealthConditions();
    if (!!diagnosis) {
      this.deleteDbData(diagnosis[0], APIUrls.PatientDiagnosis)
    }
  }  

  /**
   * Method - Update patient health conditions
   */
  updateDoctorsOrders() {
    let patient = this.intakeService.getPatient();
    const diagnosis = [...patient.diagnosis];
    //remove non-patient data except diagnosis to be sent to data service    
    patient = this.removeAllNonPatientData(patient);
    patient.diagnosis = [...diagnosis];
    if (!!patient) {
      this.updateDbData(patient, APIUrls.Patient);
    }
  }

    /**
   * Method - Delete patient health conditions
   */
  deleteDoctorsOrders() {
    const diagnosis = this.intakeService.getPatientHealthConditions();
    if (!!diagnosis) {
      this.deleteDbData(diagnosis[0], APIUrls.PatientDiagnosis)
    }
  }

/**
  * Method to update database record
  * @param entity 
  * @param apiUrl 
  */
 deleteDbData(entity: any, apiUrl:any) {
  this.spinnerService.show();
  let ret = this.dataService
    .deleteData(entity, apiUrl)
    .finally(() => {
      this.spinnerService.hide();
    })
    .subscribe(
      data => {
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
  * Method to update database record
  * @param entity 
  * @param apiUrl 
  */
  updateDbData(entity: any, apiUrl:any) {
    this.spinnerService.show();
    let ret = this.dataService
      .updateData(entity, apiUrl)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
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
}
