import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import {
  ProgressSpinnerService,
  AlertService,
  PatientInTakeService,
  CodesService
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
  SuffixCode,
  PrefixCode,
  EditHelperUserAction,
  EditHelperActionType,
  PatientRelative,
  ContactType,
  Contact
} from "model-lib";
import { SelectItem } from "primeng/api";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step3",
  templateUrl: "./patient-intake-step3.component.html"
})
export class PatientInTakeStep3Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;
  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  @Output() step3Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  isEditMode: boolean;
  relativeHomePhone: string = "";
  relativeCellPhone: string = "";
  relativeEmail: string = "";
  rootNode: any;
  activeCompanyId: string;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();
  suffixCodes: SuffixCode[];
  suffixCodesSelect: SelectItem[];
  prefixCodes: PrefixCode[];
  prefixCodesSelect: SelectItem[];
  patientRelative: PatientRelative = {};
  relationshipCodesSelect: SelectItem[] = [];
  patientRelationship: string;

  /**
   * Method - Constructor
   * @param router
   * @param spinnerService
   * @param intakeService
   * @param codesService
   * @param alertService
   */
  constructor(
    public router: Router,
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService,
    private codesService: CodesService,
    private alertService: AlertService
  ) {
    super();
    this.title = "User Profile";
    this.spinnerService.setMessage("Loading user profile page...");
    this.spinnerService.show();
  }

  /**
   * Method - Life cycle hook - component init
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
        this.getPatientRelative();
      });
    this.getPrefixCodes();
    this.getSuffixCodes();
    this.getSupplementaryCodes();
    this.getPatientRelative();
  }

  /**
   * Method - Retrieve relationship codes and others
   */
  getSupplementaryCodes() {
    this.relationshipCodesSelect = this.codesService.getRelationshipCodesSelect();
  }

  /**
   * Method - Retrieve fist patient relative value
   */
  getPatientRelative() {
    const tmpVal = this.intakeService.getPatientRelatives();
    if (!!tmpVal && tmpVal.length > 0) {
      this.patientRelative = tmpVal[0];
      if (typeof this.patientRelative.relationshipId != "undefined") {
        this.getRelationshipNameById(
          this.patientRelative.relationshipId.toString()
        );
      }
      this.getIdentContacts();
    }
  }

  /**
   * Method - Retrieve relationship name by id
   * @param id
   */
  getRelationshipNameById(id: string) {
    if (this.relationshipCodesSelect) {
      let x: any = this.relationshipCodesSelect.find(x => x.value == id);
      if (x != null && x != undefined && x != "") {
        this.patientRelationship = x.label;
      }
    }
  }

  /**
   * Method - Life cycle hook - after component init
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Save or edit form data
   */
  submitForm() {
    const _tmpPat = this.intakeService.getPatient();
    this.patientRelative.dateCreated = _tmpPat.dateCreated;
    this.patientRelative.lastUpdatedDate = _tmpPat.lastUpdatedDate;
    this.patientRelative.lastUpdatedUserId = _tmpPat.lastUpdatedUserId;
    this.updateIdentContacts();
    this.intakeService.addUpdatePatientRelative(this.patientRelative);

    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step3Status.emit(userAction);
  }

  /**
   * Method - Cancel and return to patient home page
   */
  cancel() {
    this.router.navigate(["/home/patient"]);
  }

  /**
   * Method - Return to previous page
   */
  goToPrev() {
    this.goBack.emit(true);
  }

  /**
   * Method - Cancel edit mode
   */
  cancelEditMode() {
    this.isEditMode = false;
  }

  /**
   * Method - Event handler for edit submit
   * @param event
   */
  editEventSubmit(event: any) {
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
        break;
      }
    }
  }

  /**
   * Method - Get list of prefix from code service
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
   * Method - Get list of suffix from code service
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
   * Method - Populate Prefix Drop Down select
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
   * Method - Populate suffix drop down list
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
   * Method - Get Identifications and contacts values
   */
  getIdentContacts() {
    this.relativeHomePhone = this.getContact(ContactType.homePhone).value;
    this.relativeEmail = this.getContact(ContactType.email).value;
    this.relativeCellPhone = this.getContact(ContactType.cellPhone).value;
  }

  /**
   * Method - Get referral physican contact information
   *
   */
  getContact(contactType: ContactType): Contact {
    let tmpVal: Contact = {};
    if (!!this.patientRelative.contacts) {
      const tmpValArray = this.patientRelative.contacts.filter(
        item => item.contactTypeId === contactType
      );
      if (tmpValArray.length > 0) {
        tmpVal = tmpValArray[0];
      }
    }
    return tmpVal;
  }

  /**
   * Method - Update the identifications and contacts values
   */
  updateIdentContacts() {
    this.addUpdateContactByVal(ContactType.homePhone, this.relativeHomePhone);
    this.addUpdateContactByVal(ContactType.cellPhone, this.relativeCellPhone);
    this.addUpdateContactByVal(ContactType.email, this.relativeEmail);
  }

  /**
   * Method - Add or update referral physican contact
   * @param contactType
   * @param val
   */
  addUpdateContactByVal(_contactType: ContactType, val: string) {
    if (!this.patientRelative.contacts) {
      this.patientRelative.contacts = [];
    }
    const isExistIdx = this.patientRelative.contacts.findIndex(
      item => item.contactTypeId === _contactType
    );
    if (isExistIdx > -1) {
      this.patientRelative.contacts[isExistIdx].value = val;
    } else {
      this.patientRelative.contacts.push({
        id: "",
        contactTypeId: _contactType,
        value: val
      });
    }
  }

  /**
   * Method - Get Home Phone from identifications
   */
  getHomePhone() {
    const tmpVal = this.patientRelative.contacts.filter(
      item => item.contactTypeId === ContactType.homePhone
    );
    if (tmpVal.length > 0) {
      this.relativeHomePhone = tmpVal[0].value;
    }
  }

  /**
   * Method - Get Email from identifications
   */
  getEmail() {
    const tmpVal = this.patientRelative.contacts.filter(
      item => item.contactTypeId === ContactType.email
    );
    if (tmpVal.length > 0) {
      this.relativeEmail = tmpVal[0].value;
    }
  }

  /**
   * Method - Get Email from identifications
   */
  getCellPhone() {
    const tmpVal = this.patientRelative.contacts.filter(
      item => item.contactTypeId === ContactType.cellPhone
    );
    if (tmpVal.length > 0) {
      this.relativeCellPhone = tmpVal[0].value;
    }
  }
}
