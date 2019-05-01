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
  CareConnectLocalStorage,
  ProgressSpinnerService,
  PatientInTakeService,
  CodesService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  Address,
  AddressCodes,
  PatientHealthCondition,
  AppAllergies,
  EditHelperUserAction,
  EditHelperActionType
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

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step9sub2",
  templateUrl: "./patient-intake-step9sub2.component.html"
})
export class PatientInTakeStep9Sub2Component implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  @Output() step5Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
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
  selectedHealthCondition: PatientHealthCondition;
  patientAllegies: AppAllergies[] = [];
  selectedAllergies: AppAllergies[] = [];

  constructor(
    private localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService,
    public router: Router,
    public codesService: CodesService
  ) {
    this.title = "User Profile";
    this.spinnerService.setMessage("Loading user profile page...");
    this.spinnerService.show();
  }

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
    this.populateStateDropDown();
    this.getAppAllergies();
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  validateDD(): boolean {
    let isValid: boolean = true;
    return isValid;
  }

  submitForm() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step5Status.emit(userAction);
  }

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

  cancel() {
    this.router.navigate(["/home/patient"]);
  }

  goToPrev() {
    this.goBack.emit(true);
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

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
  onRowSelectPatient(evt: any) {
    //todo
  }

  addCondition() {
    //todo
  }

  deleteCondition() {
    //todo
  }

  changeSortCondition(evt: any) {
    //todo
  }

  getHealthConditionView() {
    //todo
  }

  noSelection() {
    return true;
  }

  getAppAllergies() {
    this.patientAllegies = this.intakeService.getAllergies();
  }
}
