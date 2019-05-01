import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  Input,
  EventEmitter,
  ViewChild
} from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  EmployeeService,
  CompanyService,
  SecurityService,
  AlertService,
  ProgressSpinnerService,
  MediaService,
  CodesService
} from "service-lib";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  EditHelperUserAction,
  EditHelperActionType,
  IdentityAppUser,
  EmployeeSummary,
  AppUserTypeCodes,
  EmployeeAddress,
  UserSession,
  EmployeeProfile,
  AddressCodes
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "employee-addstep2",
  templateUrl: "./employee-addstep2.component.html"
})
export class OrgEmployeeAddStep2Component implements OnInit, OnChanges {
  employees: EmployeeSummary[] = [];
  allEmployees: EmployeeSummary[] = [];
  employeeAddress: EmployeeAddress = {};
  appUser: IdentityAppUser = {};
  employeeAddresses: EmployeeAddress[] = [];
  employeeProfile: EmployeeProfile = {};
  employeeProfiles: EmployeeProfile[] = [];
  usStateSelect: SelectItem[];
  employeeImg: string;
  employeeImgAltText: string;
  activeEmployeeId: string;
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;
  identityAppUser: IdentityAppUser = {};
  isLoading: boolean = false;
  errorMessage: string;
  displayDialogEmployee: boolean;
  selectedEmployee: EmployeeSummary = {};
  activeCompanyId: string;
  states: any[];
  @Output() step2Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  isEditMode: boolean;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();

  imguser1: any;
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    public employeeService: EmployeeService,
    private mediaService: MediaService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
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
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.states = AddressCodes.USStates;
    this.states = AddressCodes.USStates;
    this.populateStateDropDown();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.updateStatus === true) {
      this.isEditMode = false;
    }
  }

  editEventSubmit(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode = true;
        break;
      }
      case 4:
      case 2: {
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        this.employeeService.revertEmployeeData();
        this.cancelEditMode();
        break;
      }
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(["/home/personnel", "1"]);
  }

  submitForm() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.employeeService.employee.userName = this.employeeService.employee.email;
    this.step2Status.emit(userAction);
  }

  goToPrev() {
    this.goBack.emit(true);
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
}
