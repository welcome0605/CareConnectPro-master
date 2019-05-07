import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges
} from "@angular/core";
import {
  CompanyService,
  ProgressSpinnerService,
  AlertService,
  PatientInTakeService,
  CodesService,
  DataService,
  NotificationsService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  NG_VALIDATORS,
  Validator,
  Validators,
  AbstractControl,
  ValidatorFn,
  NgForm
} from "@angular/forms";
import {
  GenderCode,
  SuffixCode,
  PrefixCode,
  EditHelperUserAction,
  EditHelperActionType,
  IdType,
  ContactType,
  Patient
} from "model-lib";
import { SelectItem } from "primeng/api";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../../../shared/core";
import { Subject } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step1",
  templateUrl: "./patient-intake-step1.component.html"
})
export class PatientInTakeStep1Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: Subject<boolean> = new Subject<boolean>();
  @Output() step1Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  isEditMode: boolean;
  genderCodes: GenderCode[];
  genderCodesSelect: SelectItem[];
  suffixCodes: SuffixCode[];
  suffixCodesSelect: SelectItem[];
  maritalCodesSelect: SelectItem[];
  prefixCodes: PrefixCode[];
  prefixCodesSelect: SelectItem[];
  raceCodesSelect: SelectItem[];
  ssn: string = "";
  driversLicense: string = "";
  patientEmail: string = "";
  patientCellPhone: string = "";
  patientHomePhone: string = "";
  patient: Patient = {};
  companySubscriptions = this.companyService.companySubscriptions;
  rootNode: any;
  activeCompanyId: string;
  private patientDateOfBirth: any = new Date();
  maritalStatus: string;
  patRace: string;

  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();

  /**
   * Method - Constructor
   * @param companyService
   * @param router
   * @param localstore
   * @param spinnerService
   * @param intakeService
   * @param codesService
   * @param alertService
   * @param dataService
   */
  constructor(
    public companyService: CompanyService,
    public router: Router,
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService,
    private codesService: CodesService,
    private alertService: AlertService,
    private dataService: DataService,
    private notifyService: NotificationsService
  ) {
    super();
    this.title = "User Profile";
    this.spinnerService.setMessage("Loading user profile page...");
    this.spinnerService.show();
  }

  /**
   * Method - Component initialization
   */
  ngOnInit() {
    if (this.isNewRecord === null) {
      this.isNewRecord = false;
    }
    if (this.isNewRecord === true) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.displayUserProfile = true;
    this.displayUserSetting = false;
    this.displayUserAlerts = false;
    this.intakeService.isPatientRecordChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.getPatient();
      });
    this.getPatient();
    this.formatDateFields(false);
    this.getGenderCodes();
    this.getPrefixCodes();
    this.getSuffixCodes();
    this.getSupplementaryCodes();
    this.updateStatus.subscribe(data => {
      this.isEditMode = false;
    })
  }

  
  /**
   * Method - Retrieve race and gender codes
   */
  getSupplementaryCodes() {
    this.raceCodesSelect = this.codesService.getRaceCodesSelect();
    this.genderCodesSelect = this.codesService.getGenderCodesSelect();
    this.maritalCodesSelect = this.codesService.getMaritalCodesSelect();
  }

  /**
   * Method - To retrieve patient data from service
   */
  getPatient() {
    this.patient = this.intakeService.getPatient();
    if (typeof this.patient.maritalStatus != "undefined") {
      this.getMaritalStatusById(this.patient.maritalStatus.toString());
    }
    if (typeof this.patient.race != "undefined") {
      this.getRaceNameById(this.patient.race.toString());
    }
    this.getIdentContacts();
  }

  /**
   * Method - Get Identifications and contacts values
   */
  getIdentContacts() {
    this.driversLicense = this.intakeService.getIdentification(
      IdType.driversLicense
    ).value;
    this.patientHomePhone = this.intakeService.getContact(
      ContactType.homePhone
    ).value;
    this.patientEmail = this.intakeService.getContact(ContactType.email).value;
    this.ssn = this.intakeService.getIdentification(IdType.ssn).value;
    this.patientCellPhone = this.intakeService.getContact(
      ContactType.cellPhone
    ).value;
  }

  /**
   * Method - Update the identifications and contacts values
   */
  updateIdentContacts() {
    this.intakeService.addUpdateContactByVal(
      ContactType.homePhone,
      this.patientHomePhone
    );
    this.intakeService.addUpdateContactByVal(
      ContactType.cellPhone,
      this.patientCellPhone
    );
    this.intakeService.addUpdateContactByVal(
      ContactType.email,
      this.patientEmail
    );
    this.intakeService.addUpdateIdentificationByVal(
      IdType.driversLicense,
      this.driversLicense
    );
    this.intakeService.addUpdateIdentificationByVal(IdType.ssn, this.ssn);
  }

  /**
   * Method - Get SSN from identifications
   */
  getSsn() {
    const tmpVal = this.patient.identifications.filter(
      item => item.idTypeId === IdType.ssn
    );
    if (tmpVal.length > 0) {
      this.ssn = tmpVal[0].value;
    }
  }

  /**
   * Method - Get Email from identifications
   */
  getEmail() {
    const tmpVal = this.patient.contacts.filter(
      item => item.contactTypeId === ContactType.email
    );
    if (tmpVal.length > 0) {
      this.patientEmail = tmpVal[0].value;
    }
  }

  /**
   * Method - Get Email from identifications
   */
  getCellPhone() {
    const tmpVal = this.patient.contacts.filter(
      item => item.contactTypeId === ContactType.cellPhone
    );
    if (tmpVal.length > 0) {
      this.patientCellPhone = tmpVal[0].value;
    }
  }

  /**
   * Method - Life cycle hook - after view instructions
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Validate the date of birth
   */
  validateDD(): boolean {
    let isValid: boolean = true;
    if (this.patient.dateOfBirth === null) {
      isValid = false;
    }
    return isValid;
  }

  /**
   * Method - Submit the form
   */
  submitForm() {
      this.updateIdentContacts();
    this.intakeService.updatePatient(this.patient);
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step1Status.emit(userAction);
  }

  /**
   * Method - Retrieve race name using the id
   * @param id
   */
  getRaceNameById(id: string) {
    if (this.raceCodesSelect) {
      let x: any = this.raceCodesSelect.find(x => x.value == id);
      if (x != null && x != undefined && x != "") {
        this.patRace = x.label;
      }
    }
  }

  /**
   * Method - Retrieve marital status name using the id
   * @param id
   */
  getMaritalStatusById(id: string) {
    if (this.maritalCodesSelect) {
      let x: any = this.maritalCodesSelect.find(x => x.value == id);
      if (x != null && x != undefined && x != "") {
        this.maritalStatus = x.label;
      }
    }
  }

  /**
   * Method - On Submit logic for edit patient button
   * @param event
   */
  editEventSubmit(event: any) {
    this.formatDateFields(true);
    switch (event) {
      case 1: {
        //enable edit clicked
        this.isEditMode = true;
        break;
      }
      case 4: //update and save clicked
      case 2: {
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        //cancel clicked
        this.cancelEditMode();
        this.intakeService.revertIntakeData();
        this.formatDateFields(false);
        break;
      }
    }
  }

  /**
   * Method - Logic to handle cancel edit mode
   */
  cancelEditMode() {
    this.isEditMode = false;
  }

  /**
   * Method - Logic to cancel changes and redirect to login page
   */
  cancel() {
    this.router.navigate(["/home/patient"]);
  }

  /**
   * Method - Logic to get list of gender codes from database
   */
  public getGenderCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getGenderCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: GenderCode[] = data;
          this.genderCodes = ret;
          this.populateGenderDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read gender codes. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  /**
   * Method - Logic to retrieve list of prefix codes from database
   */
  public getPrefixCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getPrefixCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: PrefixCode[] = data;
          this.prefixCodes = ret;
          this.populatePrefixDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read prefix codes. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  /**
   * Method - Logic to retrieve suffix codes
   */
  public getSuffixCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getSuffixCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: SuffixCode[] = data;
          this.suffixCodes = ret;
          this.populateSuffixDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read suffix codes. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  /**
   * Method - Logic to insert gender code into drop down select option
   */
  populateGenderDropDown() {
    let x: any = this.genderCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(gender: any) {
      return {
        label: gender.id,
        value: gender.id
      };
    });
    this.genderCodesSelect = z;
  }

  /**
   * Method - Logic to insert prefix code into drop down select option
   */
  populatePrefixDropDown() {
    let x: any = this.prefixCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(prefix: any) {
      return {
        label: prefix.id,
        value: prefix.id
      };
    });
    this.prefixCodesSelect = z;
  }

  /**
   * Method - Logic to insert suffix code into drop down select option
   */
  populateSuffixDropDown() {
    let x: any = this.suffixCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(suffix: any) {
      return {
        label: suffix.id,
        value: suffix.id
      };
    });
    this.suffixCodesSelect = z;
  }

  /**
   * Method - Logic to format date fields
   * @param isSaved
   */
  formatDateFields(isSaved: boolean) {
    if (!!this.patient.dateOfBirth) {
      this.patientDateOfBirth = new Date(
        Date.parse(this.patient.dateOfBirth.toString())
      );
    }
    if (isSaved === true) {      
      this.patient.dateOfBirth = this.patientDateOfBirth;
    } else {
      if (this.patient.dateOfBirth != undefined) {
        this.patientDateOfBirth = new Date(
          Date.parse(this.patient.dateOfBirth.toString())
        );
      }
    }
  }
}
