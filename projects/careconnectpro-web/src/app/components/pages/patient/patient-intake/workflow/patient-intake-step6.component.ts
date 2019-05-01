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
  PatientInTakeService,
  DataService,
  NotificationsService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  Address,
  AddressCodes,
  EditHelperUserAction,
  EditHelperActionType,
  MedicalInsuranceProvider,
  ContactType,
  Contact,
  PatientMedicalInsurance,
  APIUrls,
  Message,
  AddressType
} from "model-lib";
import {
  NG_VALIDATORS,
  Validator,
  Validators,
  AbstractControl,
  ValidatorFn,
  NgForm
} from "@angular/forms";
import { SelectItem } from "primeng/api";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step6",
  templateUrl: "./patient-intake-step6.component.html"
})
export class PatientInTakeStep6Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  @Output() step6Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  isEditMode: boolean;
  primaryAddress: Address;
  states: any[];
  usStateSelect: SelectItem[];
  rootNode: any;
  activeCompanyId: string;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  activeInsurance: MedicalInsuranceProvider = {};
  activeInsuranceAddress: Address = {};
  activeInsuranceWorkPhone: string = "";
  activeInsuranceFaxPhone: string = "";
  activeInsuranceEmail: string = "";
  insuranceList: MedicalInsuranceProvider[] = [];
  activePatientInsurance: PatientMedicalInsurance = {};
  patientInsuranceList: PatientMedicalInsurance[] = [];

  /**
   * Method - Constructor
   * @param localstore
   * @param spinnerService
   * @param intakeService
   * @param router
   */
  constructor(
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService,
    public router: Router,
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
    this.intakeService.isPatientRecordChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.getPatientInsurance();
      });
    this.states = AddressCodes.USStates;
    this.populateStateDropDown();
    this.getPatientInsurance();
  }

  /**
   * Method - Life cycle hook - After component init
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Get primary insurance information
   */
  getPatientInsurance() {
    this.patientInsuranceList = this.intakeService.getPatientInsurances();
    if (!!this.patientInsuranceList && this.patientInsuranceList.length > 0) {
      this.activePatientInsurance = this.patientInsuranceList[0];

      if (!!this.activePatientInsurance.insuranceProviderId) {
        this.getInsuranceInfo(this.activePatientInsurance.insuranceProviderId);
      }
    }
  }

  /**
   * Method to retrieve insurance information from database
   * @param providerId
   */
  getInsuranceInfo(providerId: string) {
    this.spinnerService.show();
    let _provider: MedicalInsuranceProvider = {};
    let ret = this.dataService
      .getSingleData(_provider, providerId, APIUrls.InsuranceProvider)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: MedicalInsuranceProvider = data;
          if (ret != undefined || !!ret) {
            this.activeInsurance = ret;
            this.getIdentContacts();
            this.getInsuranceAddress();
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            `${Message.ErrorGetDatabaseRecordFailed} - Get Medical Provider`
          );
        }
      );
  }

  /**
   * Method - Get Identifications and contacts values
   */
  getIdentContacts() {
    this.activeInsuranceFaxPhone = this.getContact(ContactType.fax).value;
    this.activeInsuranceWorkPhone = this.getContact(
      ContactType.workPhone
    ).value;
    this.activeInsuranceEmail = this.intakeService.getContact(
      ContactType.email
    ).value;
  }

  /**
   * Method - Get referral employer contact information
   *
   */
  getContact(contactType: ContactType): Contact {
    let tmpVal: Contact = {};
    if (!!this.activeInsurance.contacts) {
      const tmpValArray = this.activeInsurance.contacts.filter(
        item => item.contactTypeId === contactType
      );
      if (tmpValArray.length > 0) {
        tmpVal = tmpValArray[0];
      }
    }
    return tmpVal;
  }

  /**
   * Method - Add or update employer contact
   * @param contactType
   * @param val
   */
  addUpdateContactByVal(_contactType: ContactType, val: string) {
    if (!this.activeInsurance.contacts) {
      this.activeInsurance.contacts = [];
    }
    const isExistIdx = this.activeInsurance.contacts.findIndex(
      item => item.contactTypeId === _contactType
    );
    if (isExistIdx > -1) {
      this.activeInsurance.contacts[isExistIdx].value = val;
    } else {
      this.activeInsurance.contacts.push({
        id: "",
        contactTypeId: _contactType,
        value: val
      });
    }
  }

  /**
   * Method - Retrieve primary employer address
   */
  getInsuranceAddress() {
    if (
      !!this.activeInsurance.addresses &&
      this.activeInsurance.addresses.length > 0
    ) {
      const primAddr = this.activeInsurance.addresses.filter(
        item => item.isPrimary === true
      );
      this.activeInsuranceAddress = primAddr ? primAddr[0] : {};
    }
  }

  /**
   * Method - Add or Update employer address
   * @param addr
   */
  addUpdateInsuranceAddress(addr: Address) {
    if (!this.activeInsurance.addresses) {
      this.activeInsurance.addresses = [];
    }
    if (!!addr.id) {
      const idx = this.activeInsurance.addresses.findIndex(
        item => item.id === addr.id
      );
      if (idx > -1) {
        this.activeInsurance.addresses[idx] = addr;
      } else {
        this.activeInsurance.addresses.push(addr);
      }
    } else {
      this.activeInsurance.addresses.push(addr);
    }
  }

  /**
   * Method - Reset form validation
   */
  validateDD(): boolean {
    let isValid: boolean = true;
    return isValid;
  }

  /**
   * Method - Submit form for processing
   */
  submitForm() {
    this.addUpdateInsuranceInfo();
  }

  /**
   * Method - Add or Update insurance
   */
  addUpdateInsuranceInfo() {
    if (!this.activeInsurance.id) {
      this.addInsuranceInfo();
    } else {
      this.updateInsuranceInfo();
    }
  }

  /**
   * Method - Update the identifications and contacts values
   */
  updateIdentContacts() {
    this.addUpdateContactByVal(
      ContactType.workPhone,
      this.activeInsuranceWorkPhone
    );
    this.addUpdateContactByVal(ContactType.fax, this.activeInsuranceFaxPhone);
    this.intakeService.addUpdateContactByVal(
      ContactType.email,
      this.activeInsuranceEmail
    );
  }

  /**
   * Method - Update Physician record
   */
  updateInsuranceInfo() {
    this.activeInsuranceAddress.addressTypeId = AddressType.mailingAddress;
    this.activeInsuranceAddress.isPrimary = true;
    this.activePatientInsurance.insuranceProviderId = this.activeInsurance.id;
    this.addUpdateInsuranceAddress(this.activeInsuranceAddress);
    this.updateIdentContacts();
    this.spinnerService.show();
    let ret = this.dataService
      .updateData(this.activeInsurance, APIUrls.InsuranceProvider)
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
            `${
              Message.ErrorUpdateDatabaseRecordFailed
            } - Medical Insurance Provider`
          );
        }
      );
  }

  /**
   * Method - Add Physician record
   */
  addInsuranceInfo() {
    let patient = this.intakeService.getPatient();
    this.activeInsuranceAddress.addressTypeId = AddressType.mailingAddress;
    this.activeInsuranceAddress.isPrimary = true;
    this.activeInsuranceAddress.lastUpdatedUserId = patient.lastUpdatedUserId;
    this.activeInsuranceAddress.dateCreated = patient.dateCreated;
    this.activeInsuranceAddress.lastUpdatedDate = patient.lastUpdatedDate;
    this.activeInsurance.dateCreated = patient.lastUpdatedDate;
    this.activeInsurance.lastUpdatedDate = patient.lastUpdatedDate;
    this.activeInsurance.lastUpdatedUserId = patient.lastUpdatedUserId;
    this.addUpdateInsuranceAddress(this.activeInsuranceAddress);
    this.updateIdentContacts();
    this.spinnerService.show();
    let ret = this.dataService
      .postData(this.activeInsurance, APIUrls.InsuranceProvider)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          this.activeInsurance.id = data;
          this.activePatientInsurance.insuranceProviderId = data;
          this.getInsuranceInfo(ret);
          this.submitFormNext();
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            `${
              Message.ErrorUpdateDatabaseRecordFailed
            } - Medical Insurance Provider`
          );
        }
      );
  }

  /**
   * Method - Event handler for submit action
   */
  submitFormNext() {
    const _tmpPat = this.intakeService.getPatient();
    this.activePatientInsurance.dateCreated = _tmpPat.dateCreated;
    this.activePatientInsurance.lastUpdatedDate = _tmpPat.lastUpdatedDate;
    this.activePatientInsurance.lastUpdatedUserId = _tmpPat.lastUpdatedUserId;
    this.addUpdateContactByVal(ContactType.fax, this.activeInsuranceFaxPhone);
    this.addUpdateContactByVal(
      ContactType.workPhone,
      this.activeInsuranceWorkPhone
    );
    this.addUpdateContactByVal(ContactType.email, this.activeInsuranceEmail);
    this.addUpdateInsuranceAddress(this.activeInsuranceAddress);
    this.intakeService.addUpdatePatientInsurance(this.activePatientInsurance);
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step6Status.emit(userAction);
  }

  /**
   * Method - Retrieve and populate state drop down
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
   * Method - Cancel and return back to patient main page
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
   * Method - Event handler for submit form data
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
}
