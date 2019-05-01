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
  SecurityService,
  AlertService,
  ProgressSpinnerService,
  MediaService
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
  AddressCodes,
  MediaFile
} from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "employee-addstep3",
  templateUrl: "./employee-addstep3.component.html"
})
export class OrgEmployeeAddStep3Component implements OnInit, OnChanges {
  employees: EmployeeSummary[] = [];
  allEmployees: EmployeeSummary[] = [];
  employeeAddress: EmployeeAddress = {};
  appUser: IdentityAppUser = {};
  employeeAddresses: EmployeeAddress[] = [];
  employeeProfile: EmployeeProfile = {};
  employeeProfiles: EmployeeProfile[] = [];
  appUserTypes: AppUserType[] = [];
  userLogin: IdentityAppUser = {};
  employeeImg: string;
  employeeImgAltText: string;
  activeEmployeeId: string;
  appUserTypeId: string;
  appUserTypeCode: string = AppUserTypeCodes.Employee;
  identityAppUser: IdentityAppUser = {};
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

  displayDialogEmployee: boolean;
  selectedEmployee: EmployeeSummary = {};
  activeCompanyId: string;
  states: any[];
  @Output() step3Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
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
    private alertService: AlertService,
    private securityService: SecurityService,
    private mediaService: MediaService,
    private spinnerService: ProgressSpinnerService
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
        this.cancelEditMode();
        this.employeeService.revertEmployeeData();
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
    if (
      this.employeeService.employee.password === this.employeeService.password2
    ) {
      if (this.isNewRecord === false) {
        this.employeeService.employee.isPasswordChange = true;
        this.submitData();
      } else {
        this.createAccountInit();
      }
    }
  }

  goToPrev() {
    this.goBack.emit(true);
  }

  private createAccountInit() {
    this.spinnerService.show();
    let ret = this.securityService
      .validateUserNameExist(this.employeeService.employee.userName)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: boolean = data;
          if (!ret) {
            this.submitData();
          } else {
            this.alertService.error(
              "Login User Name selected is already taken. Try a different user name."
            );
          }
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Create user account failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Create user account failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  submitData() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step3Status.emit(userAction);
  }
}
