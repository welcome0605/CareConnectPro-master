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
  NG_VALIDATORS,
  Validator,
  Validators,
  AbstractControl,
  ValidatorFn,
  NgForm
} from "@angular/forms";
import {
  AddressCodes,
  EditHelperUserAction,
  EditHelperActionType
} from "model-lib";
import { SelectItem } from "primeng/api";
import { Router } from "@angular/router";
import { Address } from "projects/model-lib/src/lib/models";
import { AddressType } from "projects/model-lib/src/lib/enums";
import { BaseComponent } from "../../../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step2",
  templateUrl: "./patient-intake-step2.component.html"
})
export class PatientInTakeStep2Component extends BaseComponent
  implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  @Output() step2Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  isEditMode: boolean;
  rootNode: any;
  activeCompanyId: string;
  patientAddress: Address = {};
  states: any[];
  usStateSelect: SelectItem[];
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public router: Router,
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService
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
    this.intakeService.isPatientRecordChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.getPatient();
      });

    this.states = AddressCodes.USStates;
    this.populateStateDropDown();
    this.getPatient();
  }

  /**
   * Method - Life cycle hook - after view initialization
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - To retrieve patient data from service
   */
  getPatient() {
    this.patientAddress = this.intakeService.getPatientPrimaryAddress();
  }

  /**
   * Method - submit and edit form data
   */
  submitForm() {
    const _tmpPat = this.intakeService.getPatient();
    this.patientAddress.addressTypeId = AddressType.mailingAddress;
    this.patientAddress.isPrimary = true;
    this.patientAddress.dateCreated = _tmpPat.dateCreated;
    this.patientAddress.lastUpdatedDate = _tmpPat.lastUpdatedDate;
    this.patientAddress.lastUpdatedUserId = _tmpPat.lastUpdatedUserId;
    this.intakeService.addUpdatePatientAddress(this.patientAddress);
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step2Status.emit(userAction);
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

  cancelEditMode() {
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(["/home/patient"]);
  }

  goToPrev() {
    this.goBack.emit(true);
  }
}
