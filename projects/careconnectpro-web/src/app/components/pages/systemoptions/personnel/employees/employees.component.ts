import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  CareConnectLocalStorage,
  EmployeeService,
  CompanyService,
  SecurityService,
  AlertService,
  ProgressSpinnerService,
  MediaService
} from "service-lib";
import { Router } from "@angular/router";
import {
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
  AppRole,
  MediaFile,
  APIUrls,
  Department
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "app-employee",
  templateUrl: "./employees.component.html"
})
export class OrgEmployeesComponent implements OnInit {
  employees: EmployeeSummary[] = [];
  employeeAddress: EmployeeAddress = {};
  appUser: IdentityAppUser = {};
  employeeAddresses: EmployeeAddress[] = [];
  employeeProfile: EmployeeProfile;
  employeeProfiles: EmployeeProfile[] = [];
  appUserTypes: AppUserType[] = [];
  userLogin: IdentityAppUser = {};
  appRoles: AppRole[] = [];
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
  term;

  employeeImg: string;
  employeeImgAltText: string;
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
  activeCompanyId: string = "";
  states: any[];

  imguser1: any;
  type = "emp";
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    public employeeService: EmployeeService,
    private alertService: AlertService,
    private companyService: CompanyService,
    private securityService: SecurityService,
    private mediaService: MediaService,
    private spinnerService: ProgressSpinnerService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.getAllEmployees();
    this.getAllDepartments();
    this.getAllRoles();
    this.populateViewType();
    this.employeeService.employee.isActive = true;
  }

  populateViewType() {
    let x: string[] = ["All", "Active Employees", "InActive Employees"];
    this.viewType = [
      { label: "All Employees", value: "All" },
      { label: "Active Employees", value: "Active" },
      { label: "InActive Employees", value: "Inactive" }
    ];
    this.activeViewType = "All";
  }

  getEmployeeView() {
    let x: any = this.activeViewType;
    switch (x) {
      case "All": {
        this.getAllEmployees();
        break;
      }
      case "Active": {
        this.getActiveEmployees();
        break;
      }
      case "Inactive": {
        this.getInActiveEmployees();
        break;
      }
    }
  }

  getEmployeeImg(imgName: any): any {
    let imgUrl: any;

    if (imgName != undefined && imgName != "") {
      imgUrl = APIUrls.GetImageEmployee + "/" + imgName;
    } else {
      imgUrl = this.imguser1;
    }
    return imgUrl;
  }

  RouteNewEmployee() {
    this.employeeService.initData();
    this.router.navigate(["/home/personnel/employee/add"]);
  }

  getAllDepartments() {
    this.spinnerService.show();
    let ret = this.companyService
      .getCompanyDepartmentById(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Department[] = data;
          this.employeeService.departments = ret;
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read department. Please contact Care Connect Pro service desk"
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

  getRoleNameById(id: string) {
    let ret: string = "";
    if (this.appRoles) {
      let x: any = this.appRoles.find(x => x.id == id);
      if (x != null && x != undefined && x != "") {
        ret = x.name;
      }
    }
    return ret;
  }

  getAllRoles() {
    this.spinnerService.show();
    let ret = this.securityService
      .getAllRoles(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: AppRole[] = data;
          this.employeeService.appRoles = ret;
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read roles. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  getActiveEmployees() {
    this.spinnerService.show();
    let ret = this.employeeService
      .getActiveEmployeesSummary(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: EmployeeSummary[] = data;
          this.employees = ret;
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read employees. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  getInActiveEmployees() {
    this.spinnerService.show();
    let ret = this.employeeService
      .getInActiveEmployeesSummary(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: EmployeeSummary[] = data;
          this.employees = ret;
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.spinnerService.hide();
          this.alertService.error(
            "Unable to read employees. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  getAllEmployees() {
    this.spinnerService.show();
    let ret = this.employeeService
      .getAllEmployeesSummary(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          console.log("dataaaaa");
          console.log(data);
          let ret: EmployeeSummary[] = data;
          this.employees = ret;
          this.employeeService.allEmployees = ret;
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

  changeSortEmployee(event: any) {
    if (!event.order) {
      this.sortF = "name";
    } else {
      this.sortF = event.field;
    }
  }

  onRowSelectEmployee(event: any) {
    this.employeeService.isNewEmployee = false;
    this.employeeService.employee = this.cloneEmployee(event.data);
    this.router.navigate(["/home/personnel/employee/detail"]);
  }

  cloneEmployee(a: EmployeeSummary): EmployeeSummary {
    let employee: any;
    let y: any = a;
    for (let prop in a) {
      employee[prop] = y[prop];
    }
    return employee;
  }

  findSelectedEmployeeIndex(): number {
    return this.employees.indexOf(this.selectedEmployee);
  }

  displayAddEmployeeView() {
    this.employeeService.initData();
    this.employeeService.isNewEmployee = true;
    this.employeeService.employee.isActive = true;
    this.displayProfileImage();
  }

  displayProfileImage() {
    if (
      this.employeeService.employee.photoName != null &&
      this.employeeService.employee.photoName != "" &&
      this.employeeService.employee.photoName != undefined
    ) {
      this.tempImgFile =
        APIUrls.GetImageEmployee +
        "/" +
        this.employeeService.employee.photoName;
    }
  }
}
