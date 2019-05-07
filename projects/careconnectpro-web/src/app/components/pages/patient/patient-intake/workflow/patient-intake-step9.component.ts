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
  PatientInTakeService,
  CodesService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  Address,
  PatientHealthCondition,
  EditHelperUserAction,
  EditHelperActionType,
  Patient,
  HealthConditionType,
  Allergies
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
  selector: "patient-intake-step9",
  templateUrl: "./patient-intake-step9.component.html"
})
export class PatientInTakeStep9Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: Subject<boolean> = new Subject<boolean>();
  @Output() step9Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  isEditMode: boolean;
  primaryAddress: Address;
  states: any[];
  rootNode: any;
  activeCompanyId: string;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedHealthCondition: PatientHealthCondition;
  selectedConditions: string[] = [];
  isDeleteBtnClicked: boolean = false;
  patient: Patient = {};
  private selectedConditionType: HealthConditionType;
  private step9PatientConditions: PatientHealthCondition[] = [];
  private patientHealthConditions: PatientHealthCondition[] = [];
  private step9SubStep: number = 1;
  private patientAllegies: Allergies[] = [];
  healthConditionsSelect: SelectItem[];

  constructor(
    private localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService,
    public router: Router,
    public codesService: CodesService
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
    this.intakeService.isPatientRecordChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.getPatientData();
      });
    this.getPatientData();
    if (this.isNewRecord === null) {
      this.isNewRecord = false;
    }
    if (this.isNewRecord === true) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.updateStatus.subscribe(data => {
      this.isEditMode = false;
    });
    this.healthConditionsSelect = this.codesService.getHealthConditionsSelect();
  }

  /**
   * Method - Update patient and health conditions from intake service
   */
  getPatientData() {
    this.patient = this.intakeService.getPatient();
    this.patientHealthConditions = this.intakeService.getPatientHealthConditions();
    this.step9FilterConditions();
  }

  /**
   * Method - Life cycle hook - After component init
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Call back from sub step after health condition is selected
   * @param event
   */
  updateSubStep1(event: any) {
    this.patientHealthConditions = event;
    this.step9FilterConditions();
    this.step9SubStep = 1;
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
    this.intakeService.addUpdatePatientHealthConditions(
      this.patientHealthConditions
    );
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step9Status.emit(userAction);
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
        this.submitForm();
        // this.f2.ngSubmit.emit();
        // if (this.f2.form.valid === false) {
        //   this.saveStatus.emit(false);
        //   this.isEditMode = true;
        // }
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
   * Method - Event handler
   * @param evt
   */
  onRowSelectPatient(evt: any) {
    //todo
  }

  /**
   * Method - Logic when health condition is added
   */
  addCondition() {
    this.step9SubStep = 2;
    //todo
  }

  /**
   * Method - Logic to confirm removal of health condition
   */
  confirmDelete() {
    this.isDeleteBtnClicked = true;
  }

  /**
   * Method - Logic to remove health condition
   */
  deleteCondition() {
    //todo
    this.selectedConditions.forEach(condId => {
      const idx: number = this.patientHealthConditions.findIndex(
        item => item.icdId === condId
      );
      if (idx > -1) {
        this.patientHealthConditions.splice(idx, 1);
      }
    });
    this.step9FilterConditions();
    this.selectedConditions = [];
    this.isDeleteBtnClicked = false;
  }

  /**
   * Method - Logic to cancel delete
   */
  cancelDelete() {
    this.isDeleteBtnClicked = false;
  }

  /**
   * Method - Logic to sort health condition
   */
  changeSortCondition(evt: any) {
    //todo
  }

  /**
   * Method - Logic to disable delete button
   */
  disableDeleteBtn() {
    if (this.selectedConditions.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Method - Retrieve allergy conditions
   */
  getAllergyConditions() {
    this.step9PatientConditions = [];
    if (!!this.patientHealthConditions) {
      let x: PatientHealthCondition[] = this.patientHealthConditions.filter(
        item => item.conditionTypeId === HealthConditionType.Allergy.toString()
      );
      this.step9PatientConditions = [...x];
    }
  }

  /**
   * Method - Get patient health conditions
   */
  getHealthConditions() {
    this.step9PatientConditions = [];
    let x: PatientHealthCondition[] = this.patientHealthConditions.filter(
      item =>
        item.conditionTypeId === HealthConditionType.SeriousAilment.toString()
    );
    this.step9PatientConditions = [...x];
  }

  /**
   * Method - Set view patient health conditions to value retrieved
   */
  getAllConditions() {
    this.step9PatientConditions = [];
    if (!!this.patientHealthConditions) {
      this.step9PatientConditions = [...this.patientHealthConditions];
    }
  }

  /**
   * Method - Filter list of health conditions
   */
  step9FilterConditions() {
    let x: number = Number(this.selectedConditionType);
    switch (x) {
      case HealthConditionType.Allergy: {
        this.getAllergyConditions();
        break;
      }
      case HealthConditionType.SeriousAilment: {
        this.getHealthConditions();
        break;
      }
      case HealthConditionType.All:
      default: {
        this.getAllConditions();
        break;
      }
    }
  }
}
