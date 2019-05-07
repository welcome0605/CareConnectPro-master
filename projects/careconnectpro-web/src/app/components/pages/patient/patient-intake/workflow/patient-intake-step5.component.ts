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
  CareConnectLocalStorage,
  ProgressSpinnerService,
  PatientInTakeService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  Address,
  AddressCodes,
  EditHelperUserAction,
  EditHelperActionType,
  Employer,
  ContactType,
  Contact,
  AddressType,
  EmploymentType,
  Patient
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
import { Subject } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step5",
  templateUrl: "./patient-intake-step5.component.html"
})
export class PatientInTakeStep5Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: Subject<boolean> = new Subject<boolean>();
  @Output() step5Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  isEditMode: boolean;
  primaryAddress: Address;
  states: any[];
  usStateSelect: SelectItem[];
  rootNode: any;
  activeCompanyId: string;
  employer: Employer = {};
  employerAddress: Address = {};
  employerWorkPhone: string = "";
  employerFaxPhone: string = "";
  employerEmail: string = "";
  viewPatient: Patient = {};
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Method - Constructor
   * @param localstore
   * @param spinnerService
   * @param intakeService
   * @param router
   */
  constructor(
    private localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService,
    public router: Router
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
    this.states = AddressCodes.USStates;
    this.intakeService.isPatientRecordChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.getPatient();
        this.getPatientCompany();
      });

      this.updateStatus.subscribe(data => {
        this.isEditMode = false;
      });
    this.getPatient();
    this.populateStateDropDown();
    this.getPatientCompany();
  }

  /**
   * Method - Get patient record from intake service
   */
  getPatient() {
    this.viewPatient = this.intakeService.getPatient();
  }

  /**
   * Method - Get primary company information
   */
  getPatientCompany() {
    const tmpVal = this.intakeService.getPatientEmployers();
    if (!!tmpVal && tmpVal.length > 0) {
      this.employer = tmpVal[0];
      this.getEmployerAddress();
      this.employerEmail = this.getContact(ContactType.email).value;
      this.employerFaxPhone = this.getContact(ContactType.fax).value;
      this.employerWorkPhone = this.getContact(ContactType.workPhone).value;
    }
  }

  /**
   * Method - Get referral employer contact information
   *
   */
  getContact(contactType: ContactType): Contact {
    let tmpVal: Contact = {};
    if (!!this.employer.contacts) {
      const tmpValArray = this.employer.contacts.filter(
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
    if (!this.employer.contacts) {
      this.employer.contacts = [];
    }
    const isExistIdx = this.employer.contacts.findIndex(
      item => item.contactTypeId === _contactType
    );
    if (isExistIdx > -1) {
      this.employer.contacts[isExistIdx].value = val;
    } else {
      this.employer.contacts.push({
        id: "",
        contactTypeId: _contactType,
        value: val
      });
    }
  }

  /**
   * Method - Retrieve primary employer address
   */
  getEmployerAddress() {
    if (!!this.employer.addresses && this.employer.addresses.length > 0) {
      const primAddr = this.employer.addresses.filter(
        item => item.isPrimary === true
      );
      this.employerAddress = primAddr ? primAddr[0] : {};
    }
  }

  /**
   * Method - Add or Update employer address
   * @param addr
   */
  addUpdateEmployerAddress(addr: Address) {
    if (!this.employer.addresses) {
      this.employer.addresses = [];
    }
    if (!!addr.id) {
      const idx = this.employer.addresses.findIndex(
        item => item.id === addr.id
      );
      if (idx > -1) {
        this.employer.addresses[idx] = addr;
      } else {
        this.employer.addresses.push(addr);
      }
    } else {
      this.employer.addresses.push(addr);
    }
  }

  /**
   * Method - Life cycle hook - after component initialization
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Reset form data
   */
  validateDD(): boolean {
    let isValid: boolean = true;
    return isValid;
  }

  /**
   * Method - Submit form data
   */
  submitForm() {
    const _tmpPat = this.intakeService.getPatient();
    this.employer.dateCreated = _tmpPat.dateCreated;
    this.employer.lastUpdatedDate = _tmpPat.lastUpdatedDate;
    this.employer.lastUpdatedUserId = _tmpPat.lastUpdatedUserId;
    this.employer.employmentTypeId = EmploymentType.fullTime;
    this.employer.patientId = this.viewPatient.id;
    if (!this.employer.name) {
      this.employer.name = this.employer.companyName;
    }
    this.employerAddress.addressTypeId = AddressType.mailingAddress;
    this.employerAddress.isPrimary = true;
    this.addUpdateContactByVal(ContactType.email, this.employerEmail);
    this.addUpdateContactByVal(ContactType.fax, this.employerFaxPhone);
    this.addUpdateContactByVal(ContactType.workPhone, this.employerWorkPhone);
    this.addUpdateEmployerAddress(this.employerAddress);
    this.intakeService.addUpdatePatientEmployers(this.employer);
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step5Status.emit(userAction);
  }

  /**
   * Method - Get list of valid states
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
