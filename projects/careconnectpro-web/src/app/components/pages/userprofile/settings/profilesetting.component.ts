import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  SecurityService,
  EmployeeService,
  CompanyService,
  MediaService,
  CodesService,
  AlertService,
  ProgressSpinnerService
} from "service-lib";
import { Router } from "@angular/router";
import {
  UserSession,
  AppRole,
  EmployeeSummary,
  EmployeeAddress,
  AppUserType,
  EmployeeProfile,
  IdentityAppUser,
  Department,
  SalaryCode,
  GenderCode,
  SuffixCode,
  PrefixCode,
  AppUserTypeCodes,
  MediaFile,
  UserLogin
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";
import { BaseComponent } from "../../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-userprofilesetting",
  templateUrl: "./profilesetting.component.html"
})
export class UserProfileSettingComponent extends BaseComponent
  implements OnInit {
  employees: EmployeeSummary[];
  allEmployees: EmployeeSummary[];
  employee: EmployeeSummary = {};
  employeeAddress: any = {};
  appUser: any = {};
  employeeAddresses: EmployeeAddress[];
  employeeProfile: any;
  employeeProfiles: EmployeeProfile[];
  appUserTypes: AppUserType[];
  userLogin: IdentityAppUser;
  departments: Department[];
  appRoles: AppRole[];
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
  managerName: string = "";
  password2: string = "";
  activeEmployeeId: string;
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;
  identityAppUser: IdentityAppUser;
  dateHired: any;
  dateTerminated: any;
  dateOfBirth: any;
  activeActionCred: string = "0";
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  isLoading: boolean = false;
  profilePics: any[] = [];
  mediaurl: string;
  tempImgFile: string = "";
  fileList: MediaFile = {
    fileName: "",
    filePath: "",
    companyFile: "",
    employeeFile: "",
    physicianFile: "",
    vendorFile: ""
  };
  errorMessage: string;
  userSession: UserSession = {};
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  displayDialogEmployee: boolean;
  selectedEmployee: EmployeeSummary = {};
  isNewEmployee: boolean = false;
  newEmployee: boolean;
  activeCompanyId: string;
  states: any[];
  isEditMode: boolean;
  currentUser: UserLogin;

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {
    super();
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.initComponentData();
  }

  initComponentData() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.currentUser = this.localStore.getLoginToken();
    this.getEmployee();
    this.apphtmlcontrol.enableThemeSwitcher();
    this.isEditMode = false;
    this.employee.isPasswordChange = false;
  }

  updatePassword() {
    this.employee.isPasswordChange = true;
    this.updateEmployee();
  }

  saveTheme(event: any) {
    switch (event) {
      case 4: {
        this.isEditMode = true;
        this.updateEmployee();
        break;
      }
    }
  }

  saveUserCred(event: any) {
    let status: boolean = false;
    switch (event) {
      case 1: {
        this.isEditMode = true;
        break;
      }
      case 2: {
        if (this.employee.password === this.password2) {
          this.updatePassword();
          status = true;
        } else {
          this.activeActionCred = "1";
          status = false;
        }
        this.saveStatus2.emit(status);
        break;
      }
      case 3: {
        this.cancelEditMode();
        status = true;
        this.saveStatus2.emit(status);
        break;
      }
    }
  }

  postActionsAfterGetEmployee() {
    this.apphtmlcontrol.selectAppThemeOnControl(this.employee.defaultTheme);
  }

  getEmployee() {
    if (this.userSession.employeeId) {
      this.spinnerService.show();
      let ret = this.employeeService
        .getEmployeeSummaryById(this.userSession.employeeId)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: EmployeeSummary = data;
            this.employee = ret;
            this.spinnerService.hide();
            this.postActionsAfterGetEmployee();
          },
          (error: any) => {
            this.alertService.clear();
            this.spinnerService.hide();
            this.alertService.error(
              "Unable to read employees. Please contact Care Connect Pro service desk"
            );
          }
        );
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
    this.employee.isPasswordChange = false;
    this.employee.password = "***************";
    this.password2 = "";
  }

  updateEmployee() {
    if (!this.isEditMode) {
      this.isEditMode = true;
      this.employee.password = "";
    } else {
      this.password2 = "";
      this.employee.defaultTheme = this.localStore.getActiveTheme();
      this.isEditMode = false;
      this.employee.dateTerminated = this.dateTerminated;
      this.employee.dateHired = this.dateHired;
      this.employee.dateOfBirth = this.dateOfBirth;
      this.spinnerService.show();
      let ret = this.employeeService
        .updateEmployee(this.employee)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let x: any = data;
            this.notifyService.notify(
              "success",
              "User Profile",
              "Updated Successfully"
            );
          },
          error => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );
    }
  }
}
