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
  CodesService,
  IcdOasisService,
  AlertService
} from "service-lib";
import "rxjs/add/operator/finally";
import {
  Address,
  PatientHealthCondition,
  IcdSearchType,
  HealthConditionType,
  Provider,
  IcdCode,
  IcdCodeMaster,
  EditHelperUserAction,
  EditHelperActionType,
  Physician
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
import { Checkbox } from "primeng/primeng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-intake-step9sub1",
  templateUrl: "./patient-intake-step9sub1.component.html"
})
export class PatientInTakeStep9Sub1Component implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  @Input() patientHealthConditions: PatientHealthCondition[];
  @Output() step5Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() execStatus: EventEmitter<
    PatientHealthCondition[]
  > = new EventEmitter<PatientHealthCondition[]>();
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
  searchType: IcdSearchType = IcdSearchType.Description;
  searchKey: string = "";
  healthConditions: IcdCode[] = [];
  selectedConditions: IcdCode[] = [];
  icdSearchTypeSelect: SelectItem[];
  val1: any;
  cols: any[] = [
    // {field: 'chkbox', header: ''},
    { field: "code", header: "ICD Code" },
    { field: "description", header: "Description" }
  ];

  constructor(
    private spinnerService: ProgressSpinnerService,
    public intakeService: PatientInTakeService,
    public router: Router,
    public codesService: CodesService,
    private icdOasisService: IcdOasisService,
    private alertService: AlertService
  ) {
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
    this.icdSearchTypeSelect = this.codesService.getIcdSearchTypeSelect();
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

  search() {
    switch (this.searchType) {
      case IcdSearchType.Description: {
        this.getIcdByDescription();
        break;
      }
      case IcdSearchType.Icd: {
        this.getIcdByCode();
        break;
      }
    }
  }

  getIcdByDescription() {
    this.spinnerService.show();
    let ret = this.icdOasisService
      .getIcdByDescription(this.searchKey)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          this.populateHealthConditions(data);
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to retrieve ICD data. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  getIcdByCode() {
    this.spinnerService.show();
    let ret = this.icdOasisService
      .getIcdByCode(this.searchKey)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          this.populateHealthConditions(data);
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to retrieve ICD data. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  returnStep9() {
    this.execStatus.emit(this.patientHealthConditions);
  }

  add() {
    if (!this.patientHealthConditions) {
      this.patientHealthConditions = [];
    }
    if (this.selectedConditions.length > 0) {
      this.selectedConditions.forEach(selCondition => {
        const tmpProvider: string = "";
        let tmpPhysician: string = "";
        this.patientHealthConditions.push({
          id: "",
          icdId: selCondition.code,
          notes: selCondition.description,
          conditionTypeId: HealthConditionType.SeriousAilment.toString(),
          medProviderId: tmpProvider,
          physicianId: tmpPhysician
        });
      });
      this.returnStep9();
    }
  }

  populateHealthConditions(icdData: IcdCodeMaster[]) {
    this.healthConditions = [];
    icdData.forEach(item => {
      this.healthConditions.push({
        isSelected: false,
        icdId: item.icdId,
        code: item.code,
        description: item.description
      });
    });
  }
}
