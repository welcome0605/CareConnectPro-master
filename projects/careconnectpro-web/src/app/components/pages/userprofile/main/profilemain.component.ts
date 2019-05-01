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
import { NgForm } from "@angular/forms";
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
  UserLogin,
  AddressCodes,
  APIUrls
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../../shared/core";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-userprofilemain",
  templateUrl: "./profilemain.component.html"
})
export class UserProfileMainComponent extends BaseComponent implements OnInit {
  employees: EmployeeSummary[];
  allEmployees: EmployeeSummary[];
  employee: EmployeeSummary = {};
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
  imguser1: any;
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
  isEditMode1: boolean;
  isEditMode2: boolean;
  @ViewChild("f1") f1: NgForm;
  saveStatus1: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("f2") f2: NgForm;
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("f3") f3: NgForm;
  saveStatus3: EventEmitter<boolean> = new EventEmitter();
  currentUser: UserLogin;
  userSession: UserSession;

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private companyService: CompanyService,
    private securityService: SecurityService,
    private mediaService: MediaService,
    private codesService: CodesService,
    private spinnerService: ProgressSpinnerService
  ) {
    super();
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.initComponentData();
  }

  initComponentData() {
    this.activeCompanyId = this.userSession.companyId;
    this.currentUser = this.localStore.getLoginToken();
    this.getEmployee();
    this.getAllDepartments();
    this.getAllRoles();
    this.getGenderCodes();
    this.getPrefixCodes();
    this.getSuffixCodes();
    this.getSalaryCodes();
    this.states = AddressCodes.USStates;
    this.populateStateDropDown();
    this.apphtmlcontrol.enableThemeSwitcher();
    this.isEditMode1 = false;
    this.isEditMode2 = false;
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
            this.displayProfileImage();
            if (ret.reportToId) {
              this.getEmployeeNameById(ret.reportToId);
            }
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

  editAboutMe(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode1 = true;
        break;
      }
      case 4:
      case 2: {
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus1.emit(false);
          this.isEditMode1 = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode1();
        this.getEmployee();
        break;
      }
    }
  }

  saveUpdateEmployee1() {
    this.saveStatus1.emit(true);
    this.moveProfilePictureToServer();
  }

  editPersonalData(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode2 = true;
        break;
      }
      case 4:
      case 2: {
        this.f1.ngSubmit.emit();
        if (this.f1.form.valid === false) {
          this.saveStatus2.emit(false);
          this.isEditMode2 = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode2();
        this.getEmployee();
        break;
      }
    }
  }

  saveUpdateEmployee2() {
    this.saveStatus2.emit(true);
    this.updateEmployee2();
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

  cancelEditMode1() {
    this.isEditMode1 = false;
  }

  cancelEditMode2() {
    this.isEditMode2 = false;
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

  public getFiles() {
    this.errorMessage = "";
    this.spinnerService.show();
    this.mediaService
      .mediaImagesEmployeeGetAll(this.employee.employeeId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (files: any) => {
          if (files != null) {
            this.fileList.fileName = files[0].fileName;
            this.fileList.filePath = files[0].filePath;
            this.fileList.companyFile = "";
            this.tempImgFile =
              APIUrls.GetImageEmployeeTemp + "/" + files[0].fileName;
          }
        },
        (error: any) => {
          this.errorMessage = <any>error;
        }
      );
  }

  displayProfileImage() {
    this.mediaurl =
      APIUrls.MediaImagesEmployeePreview + "/" + this.employee.employeeId;

    if (
      this.employee.photoName != null &&
      this.employee.photoName != "" &&
      this.employee.photoName != undefined
    ) {
      this.tempImgFile =
        APIUrls.GetImageEmployee + "/" + this.employee.photoName;
    }
  }

  moveProfilePictureToServer() {
    //save logo first
    if (this.fileList.fileName != "") {
      let x: any = this.fileList.fileName.split(".");
      if (x.length > 0) {
        this.fileList.employeeFile =
          this.employee.employeeId + "." + x[x.length - 1];
      } else {
        this.fileList.employeeFile = "";
      }
      this.spinnerService.show();
      this.mediaService
        .mediaImagesEmployeeSave(this.fileList)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          response => {
            // Refresh file list
            this.employee.photoName = this.fileList.employeeFile;
            this.updateEmployee1();
          },
          (error: any) => {
            this.errorMessage = <any>error;
          }
        );
    } else {
      this.updateEmployee1();
    }
  }

  updateEmployee1() {
    if (!this.isEditMode1) {
      this.isEditMode1 = true;
    } else {
      this.isEditMode1 = false;
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

  updateEmployee2() {
    if (!this.isEditMode2) {
      this.isEditMode2 = true;
    } else {
      this.isEditMode2 = false;
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

  private saveEmployee() {
    this.employee.defaultTheme = this.localStore.getActiveTheme();
    this.moveProfilePictureToServer();
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
          //this.populateSalaryDropDown();
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
          this.departments = ret;
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

  public onUpload(event: any) {
    this.getFiles();
  }

  getDepartmentNameById(id: string) {
    let ret: string = "";
    if (this.departments) {
      let x: any = this.departments.find(x => x.id == id);
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

  getEmployeeNameById(employeeId: string) {
    this.spinnerService.show();
    let ret = this.employeeService
      .getEmployeeSummaryById(employeeId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: EmployeeSummary = data;
          this.managerName = ret.firstName + " " + ret.lastName;
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.spinnerService.hide();
          this.alertService.error(
            "Unable to read employees. Please contact Care Connect Pro service desk"
          );
          //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
        }
      );
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
          this.appRoles = ret;
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read roles. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  getEmployeeImg(): any {
    let imgUrl: any;

    if (this.tempImgFile != undefined && this.tempImgFile != "") {
      imgUrl = this.tempImgFile;
    } else {
      imgUrl = this.imguser1;
    }
    return imgUrl;
  }
}
