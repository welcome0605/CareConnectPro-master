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
  Address,
  AddressCodes,
  SuffixCode,
  PrefixCode,
  EditHelperUserAction,
  EditHelperActionType,
  ContactType,
  Contact,
  APIUrls,
  Message,
  AddressType
} from "model-lib";
import { Router } from "@angular/router";
import { SelectItem } from "primeng/api";
import {
  Physician,
  ReferralDoctor,
  Patient
} from "projects/model-lib/src/lib/models";
import { BaseComponent } from "../../../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step4",
  templateUrl: "./patient-intake-step4.component.html"
})
export class PatientInTakeStep4Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  @Output() step4Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  isEditMode: boolean;
  suffixCodes: SuffixCode[];
  suffixCodesSelect: SelectItem[];
  prefixCodes: PrefixCode[];
  prefixCodesSelect: SelectItem[];
  physician: Physician = {};
  physicianAddress: Address = {};
  referrals: ReferralDoctor[] = [];
  referral: ReferralDoctor = {};
  rootNode: any;
  activeCompanyId: string;
  physicianWorkPhone: string = "";
  physicianFaxPhone: string = "";
  physicianEmail: string = "";
  states: any[];
  usStateSelect: SelectItem[];
  viewPatient: Patient = {};

  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();

  /**
   * Method - Constructor
   * @param localstore
   * @param spinnerService
   * @param intakeService
   * @param router
   * @param codesService
   * @param alertService
   */
  constructor(
    private spinnerService: ProgressSpinnerService,
    private intakeService: PatientInTakeService,
    public router: Router,
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
   * Method - Life cycle hook - component initialization
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
        this.getPatientReferrals();
      });
    this.getPatient();
    this.getPrefixCodes();
    this.getSuffixCodes();
    this.states = AddressCodes.USStates;
    this.populateStateDropDown();
    this.getPatientReferrals();
  }

  /**
   * Method - Retrieve fist patient relative value
   */
  getPatientReferrals() {
    const tmpVal = this.intakeService.getPatientReferrals();
    if (!!tmpVal && tmpVal.length > 0) {
      this.referrals = tmpVal;
      this.getPhysicianInfo(this.referrals[0].physicianId);
    }
  }

  /**
   * Method - Add Physician record
   */
  addPhysicianInfo() {
    this.physician.companyId = this.viewPatient.companyId;
    this.physician.isActive = true;
    this.physician.dateCreated = this.viewPatient.dateCreated;
    this.physician.lastUpdatedUserId = this.viewPatient.lastUpdatedUserId;
    this.physicianAddress.addressTypeId = AddressType.mailingAddress;
    this.physicianAddress.isPrimary = true;
    this.addUpdatePhysicianAddress(this.physicianAddress);
    this.updateIdentContacts();
    this.spinnerService.show();
    let ret = this.dataService
      .postData(this.physician, APIUrls.PhysicianAddPhysician)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          this.referral.physicianId = data;
          this.getPhysicianInfo(ret);
          this.submitFormNext();
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            `${Message.ErrorUpdateDatabaseRecordFailed} - Physician`
          );
        }
      );
  }

  /**
   * Method - Add or Update physician
   */
  addUpdatePhysicianInfo() {
    if (!this.physician.id) {
      this.addPhysicianInfo();
    } else {
      this.updatePhysicianInfo();
    }
  }

  /**
   * Method - Update Physician record
   */
  updatePhysicianInfo() {
    this.physician.companyId = this.viewPatient.companyId;
    this.physicianAddress.addressTypeId = AddressType.mailingAddress;
    this.physician.isActive = true;
    this.physician.dateCreated = this.viewPatient.dateCreated;
    this.physician.lastUpdatedUserId = this.viewPatient.lastUpdatedUserId;
    this.referral.physicianId = this.physician.id;
    this.addUpdatePhysicianAddress(this.physicianAddress);
    this.updateIdentContacts();
    this.spinnerService.show();
    let ret = this.dataService
      .updateData(this.physician, APIUrls.PhysicianUpdatePhysician)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          this.submitFormNext();
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            `${Message.ErrorUpdateDatabaseRecordFailed} - Physician`
          );
        }
      );
  }

  /**
   * Method - Update the identifications and contacts values
   */
  updateIdentContacts() {
    this.addUpdateContactByVal(ContactType.workPhone, this.physicianWorkPhone);
    this.addUpdateContactByVal(ContactType.email, this.physicianEmail);
    this.addUpdateContactByVal(ContactType.fax, this.physicianFaxPhone);
  }

  /**
   * Method - Get Physician Details
   * @param physicianId
   */
  getPhysicianInfo(physicianId: string) {
    this.spinnerService.show();
    let _physician: Physician = {};
    let ret = this.dataService
      .getSingleData(_physician, physicianId, APIUrls.PhysicianGetPhysicianById)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: Physician = data;
          if (ret != undefined || !!ret) {
            this.physician = ret;
            this.getIdentContacts();
            this.getReferralAddress();
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            `${Message.ErrorGetDatabaseRecordFailed} - Referrals`
          );
        }
      );
  }

  /**
   * Method - Get Identifications and contacts values
   */
  getIdentContacts() {
    this.physicianFaxPhone = this.getContact(ContactType.fax).value;
    this.physicianWorkPhone = this.getContact(ContactType.workPhone).value;
    this.physicianEmail = this.getContact(ContactType.email).value;
  }

  /**
   * Method - Add or Update physician address list
   * @param addr
   */
  addUpdatePhysicianAddress(addr: Address) {
    if (this.physician.addresses === undefined) {
      this.physician.addresses = [];
    }
    if (!!addr.id) {
      const idx = this.physician.addresses.findIndex(
        item => item.id === addr.id
      );
      if (idx > -1) {
        this.physician.addresses[idx] = addr;
      } else {
        this.physician.addresses.push(addr);
      }
    } else {
      this.physician.addresses.push(addr);
    }
  }

  /**
   * Method - Life cycle hook - after component initialization
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Get primary referral Address
   */
  getReferralAddress() {
    if (!!this.physician.addresses && this.physician.addresses.length > 0) {
      const primAddr = this.physician.addresses.filter(
        item => item.isPrimary === true
      );
      this.physicianAddress = primAddr ? primAddr[0] : {};
    }
  }

  /**
   * Method - Get patient record from intake service
   */
  getPatient() {
    this.viewPatient = this.intakeService.getPatient();
  }

  /**
   * Method - Get referral physican contact information
   *
   */
  getContact(contactType: ContactType): Contact {
    let tmpVal: Contact = {};
    if (!!this.physician.contacts) {
      const tmpValArray = this.physician.contacts.filter(
        item => item.contactTypeId === contactType
      );
      if (tmpValArray.length > 0) {
        tmpVal = tmpValArray[0];
      }
    }
    return tmpVal;
  }

  /**
   * Method - Add or update referral physican contact
   * @param contactType
   * @param val
   */
  addUpdateContactByVal(_contactType: ContactType, val: string) {
    if (!this.physician.contacts) {
      this.physician.contacts = [];
    }
    const isExistIdx = this.physician.contacts.findIndex(
      item => item.contactTypeId === _contactType
    );
    if (isExistIdx > -1) {
      this.physician.contacts[isExistIdx].value = val;
    } else {
      this.physician.contacts.push({
        id: "",
        contactTypeId: _contactType,
        value: val
      });
    }
  }

  /**
   * Method - Reset validation
   */
  validateDD(): boolean {
    let isValid: boolean = true;
    return isValid;
  }

  /**
   * Method - Submit form for processing
   */
  submitForm() {
    this.addUpdatePhysicianInfo();
  }

  /**
   * Method - Update referral record in intake service
   */
  submitFormNext() {
    const _tmpPat = this.intakeService.getPatient();
    this.referral.dateCreated = _tmpPat.dateCreated;
    this.referral.patientId = _tmpPat.id;
    this.referral.lastUpdatedDate = _tmpPat.lastUpdatedDate;
    this.referral.lastUpdatedUserId = _tmpPat.lastUpdatedUserId;
    this.intakeService.addUpdatePatientReferrals(this.referral);
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step4Status.emit(userAction);
  }

  /**
   * Method - Cancel and return to patient home
   */
  cancel() {
    this.router.navigate(["/home/patient"]);
  }

  /**
   * Method - Go to previous page
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
   * Method - Cancel edit mode
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
   * Method - Insert list of states into drop down select
   */
  populateStateDropDown() {
    let x: any = this.states;
    let y: any = x.sort(function(a: any, b: any) {
      return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
    });
    let z: any = y.map(function(usstate: any) {
      return {
        label: usstate.value,
        value: usstate.id
      };
    });
    this.usStateSelect = z;
  }

  /**
   * Method - Insert list of prefix into prefix drop down
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
   * Method - Insert list of suffix into suffix drop down select
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
   * Method - Retrieve list of prefix codes from service
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
   * Method - Retrieve list of suffix codes from service
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
   * Method - Add or Update physician referral address
   * @param addr
   */
  addUpdateReferralAddress(addr: Address) {
    if (!this.physician.addresses) {
      this.physician.addresses = [];
    }
    if (!!addr.id) {
      const idx = this.physician.addresses.findIndex(
        item => item.id === addr.id
      );
      if (idx > -1) {
        this.physician.addresses[idx] = addr;
      } else {
        this.physician.addresses.push(addr);
      }
    } else {
      this.physician.addresses.push(addr);
    }
  }
}
