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
  EmployeeService,
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
  AppUserType,
  GenderCode,
  SalaryCode,
  PrefixCode,
  SuffixCode,
  AddressCodes
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "employee-addstep1",
  templateUrl: "./employee-addstep1.component.html"
})
export class OrgEmployeeAddStep1Component implements OnInit, OnChanges {
  employees: EmployeeSummary[] = [];
  employeeAddress: EmployeeAddress = {};
  appUser: IdentityAppUser = {};
  employeeAddresses: EmployeeAddress[] = [];
  employeeProfile: EmployeeProfile = {};
  employeeProfiles: EmployeeProfile[] = [];
  appUserTypes: AppUserType[] = [];
  userLogin: IdentityAppUser;
  appRolesSelect: SelectItem[];
  departmentsSelect: SelectItem[];
  employeesSelect: SelectItem[];
  usStateSelect: SelectItem[];
  salaryCodes: SalaryCode[];
  salaryCodesSelect: SelectItem[];
  genderCodes: GenderCode[];
  genderCodesSelect: SelectItem[];
  suffixCodes: SuffixCode[];
  suffixCodesSelect: SelectItem[];
  prefixCodes: PrefixCode[];
  prefixCodesSelect: SelectItem[];
  viewType: SelectItem[];
  activeViewType: string;
  employeeImg: string;
  employeeImgAltText: string;

  activeEmployeeId: string;
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;

  identityAppUser: IdentityAppUser;
  dateOfBirth: any;

  isLoading: boolean = false;
  errorMessage: string;

  displayDialogEmployee: boolean;
  selectedEmployee: EmployeeSummary;
  activeCompanyId: string;
  states: any[];
  confirmDeActivate: boolean = false;
  confirmActivate: boolean = false;

  @Output() step1Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  isEditMode: boolean;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();
  userSession: UserSession = {};

  imguser1: any;

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    public employeeService: EmployeeService,
    private alertService: AlertService,
    private mediaService: MediaService,
    private codesService: CodesService,
    private spinnerService: ProgressSpinnerService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    if (this.isNewRecord === null) {
      this.isNewRecord = false;
    }
    if (this.isNewRecord === true) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.activeCompanyId = this.userSession.companyId;
    this.formatDateFields(false);
    this.getGenderCodes();
    this.getPrefixCodes();
    this.getSuffixCodes();
    this.getSalaryCodes();
    this.states = AddressCodes.USStates;
    this.populateStateDropDown();
    this.populateDeptDropDown();
    this.populateRolesDropDown();
    this.populateReportToDropDown();
  }

  formatDateFields(isSaved: boolean) {
    if (isSaved === true) {
      this.employeeService.employee.dateOfBirth = this.dateOfBirth;
    } else {
      if (this.employeeService.employee.dateOfBirth != undefined) {
        this.dateOfBirth = new Date(
          Date.parse(this.employeeService.employee.dateOfBirth.toString())
        );
      }
    }
  }

  cancel() {
    this.router.navigate(["/home/personnel", "1"]);
  }

  editEventSubmit(event: any) {
    this.formatDateFields(true);
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
        this.employeeService.revertEmployeeData();
        this.formatDateFields(false);
        break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.updateStatus === true) {
      this.isEditMode = false;
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  public getGenderCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getGenderCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: GenderCode[] = data;
          this.genderCodes = ret;
          this.populateGenderDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read gender codes. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  public getSalaryCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getSalaryCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: SalaryCode[] = data;
          this.salaryCodes = ret;
          this.populateSalaryDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read salary codes. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

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

  getDepartmentNameById(id: string) {
    let ret: string = "";
    if (this.employeeService.departments) {
      let x: any = this.employeeService.departments.find(x => x.id == id);
      if (x != null && x != undefined && x != "") {
        ret = x.name;
      }
    }

    return ret;
  }

  validateDD(): boolean {
    let isValid: boolean = true;

    if (this.employeeService.employee.dateOfBirth === null) {
      isValid = false;
    }

    return isValid;
  }

  getRoleNameById(id: string) {
    let ret: string = "";
    if (this.employeeService.appRoles) {
      let x: any = this.employeeService.appRoles.find(x => x.id == id);
      if (x != null && x != undefined && x != "") {
        ret = x.name;
      }
    }
    return ret;
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

  populateDeptDropDown() {
    let x: any = this.employeeService.departments;
    let y: any = x.sort(function(a: any, b: any) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    let z: any = y.map(function(dept: any) {
      return {
        label: dept.name,
        value: dept.id
      };
    });
    this.departmentsSelect = z;
  }

  populateGenderDropDown() {
    let x: any = this.genderCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(gender: any) {
      return {
        label: gender.id,
        value: gender.id
      };
    });
    this.genderCodesSelect = z;
  }

  populateSalaryDropDown() {
    let x: any = this.salaryCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(salary: any) {
      return {
        label: salary.id,
        value: salary.id
      };
    });
    this.salaryCodesSelect = z;
  }

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

  populateRolesDropDown() {
    let x: any = this.employeeService.appRoles;
    let y: any = x.sort(function(a: any, b: any) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    let z: any = y.map(function(role: any) {
      return {
        label: role.name,
        value: role.id
      };
    });
    this.appRolesSelect = z;
  }

  populateReportToDropDown() {
    let x: any = this.employeeService.allEmployees;
    let y: any = x.sort(function(a: any, b: any) {
      return a.lastName > b.lastName ? 1 : b.lastName > a.lastName ? -1 : 0;
    });
    let z: any = y.map(function(employee: any) {
      return {
        label: employee.lastName + "," + employee.firstName,
        value: employee.employeeId
      };
    });
    this.employeesSelect = z;
  }

  submitForm() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step1Status.emit(userAction);
  }

  deActivateUser() {
    const userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.delete,
      isSuccess: true
    };
    this.step1Status.emit(userAction);
    this.saveStatus.emit(true);
    this.cancelAction();
  }

  activateUser() {
    const userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.reActivate,
      isSuccess: true
    };
    this.step1Status.emit(userAction);
    this.saveStatus.emit(true);
    this.cancelAction();
  }

  confirmDelete() {
    this.confirmDeActivate = true;
  }

  confirmReActivation() {
    this.confirmActivate = true;
  }

  goToPrev() {
    this.goBack.emit(true);
  }

  cancelAction() {
    this.confirmActivate = false;
    this.confirmDeActivate = false;
  }
}
