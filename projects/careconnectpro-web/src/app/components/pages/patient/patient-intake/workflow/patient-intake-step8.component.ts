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
import { ProgressSpinnerService, PatientInTakeService } from "service-lib";
import "rxjs/add/operator/finally";
import {
  Address,
  AddressCodes,
  EditHelperUserAction,
  EditHelperActionType,
  PatientMedicalInsurance
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
  selector: "patient-intake-step8",
  templateUrl: "./patient-intake-step8.component.html"
})
export class PatientInTakeStep8Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  @Output() step8Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
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
  patientInsurance: PatientMedicalInsurance = {};

  constructor(
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
        this.getPatientInsurance();
      });
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
    const tmpVal = this.intakeService.getPatientInsurances();
    if (!!tmpVal && tmpVal.length > 0) {
      this.patientInsurance = tmpVal[0];
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
   * Method - Event handler for submit action
   */
  submitForm() {
    const _tmpPat = this.intakeService.getPatient();
    this.patientInsurance.dateCreated = _tmpPat.dateCreated;
    this.patientInsurance.lastUpdatedDate = _tmpPat.lastUpdatedDate;
    this.patientInsurance.lastUpdatedUserId = _tmpPat.lastUpdatedUserId;
    this.intakeService.addUpdatePatientInsurance(this.patientInsurance);
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step8Status.emit(userAction);
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
