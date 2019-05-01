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
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  UserSession,
  AppRole,
  AppAsset,
  AppRolePermission,
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
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../../shared/core";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-userprofilealert",
  templateUrl: "./profilealert.component.html"
})
export class UserProfileAlertComponent extends BaseComponent implements OnInit {
  employees: EmployeeSummary[];
  allEmployees: EmployeeSummary[];
  employee: any;
  employeeAddress: any;
  appUser: any;
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
  activeEmployeeId: string;
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;
  identityAppUser: IdentityAppUser;
  dateHired: any;
  dateTerminated: any;
  dateOfBirth: any;
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
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  displayDialogEmployee: boolean;
  selectedEmployee: EmployeeSummary;
  isNewEmployee: boolean = false;
  newEmployee: boolean;
  activeCompanyId: string;
  states: any[];
  isEditMode: boolean;
  userSession: UserSession;
  currentUser: UserLogin;

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    private localStore: CareConnectLocalStorage,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private companyService: CompanyService,
    private securityService: SecurityService,
    private mediaService: MediaService,
    private codesService: CodesService,
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
}
