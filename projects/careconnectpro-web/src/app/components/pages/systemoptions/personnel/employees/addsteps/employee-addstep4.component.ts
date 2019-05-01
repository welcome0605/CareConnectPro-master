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
  AppUserType,
  AddressCodes,
  MediaFile,
  APIUrls
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "employee-addstep4",
  templateUrl: "./employee-addstep4.component.html"
})
export class OrgEmployeeAddStep4Component implements OnInit, OnChanges {
  employees: EmployeeSummary[] = [];
  allEmployees: EmployeeSummary[] = [];
  employeeAddress: EmployeeAddress = {};
  appUser: IdentityAppUser = {};
  employeeAddresses: EmployeeAddress[] = [];
  employeeProfile: EmployeeProfile = {};
  employeeProfiles: EmployeeProfile[] = [];
  appUserTypes: AppUserType[] = [];
  userLogin: IdentityAppUser = {};
  viewType: SelectItem[];
  activeViewType: string;
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
  selectedEmployee: EmployeeSummary = {};

  activeCompanyId: string;
  states: any[];
  @Output() step4Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
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
    private localStore: CareConnectLocalStorage,
    public employeeService: EmployeeService,
    private securityService: SecurityService,
    private mediaService: MediaService,
    private spinnerService: ProgressSpinnerService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.updateStatus === true) {
      this.isEditMode = false;
    }
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
    this.apphtmlcontrol.enableThemeSwitcher();
    this.getMediaUrl();
  }

  getMediaUrl() {
    if (this.isNewRecord === true) {
      this.getNewEmployeeGuid();
    } else {
      this.activeEmployeeId = this.employeeService.employee.employeeId;
      this.mediaurl =
        APIUrls.MediaImagesEmployeePreview + "/" + this.activeEmployeeId;
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
    this.employeeService.employee.defaultTheme = this.localStore.getActiveTheme();
    this.moveProfilePictureToServer();
  }

  submitData() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step4Status.emit(userAction);
  }

  goToPrev() {
    this.goBack.emit(true);
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

  public onUpload(event: any) {
    this.getFiles();
  }

  public getFiles() {
    this.errorMessage = "";
    this.spinnerService.show();
    this.mediaService
      .mediaImagesEmployeeGetAll(this.employeeService.employee.employeeId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (files: any) => {
          if (files != null && files.length > 0) {
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

  getNewEmployeeGuid() {
    if (this.employeeService.employee.employeeId === undefined) {
      this.errorMessage = "";
      this.spinnerService.show();
      if (
        this.employeeService.employee.employeeId == null ||
        this.employeeService.employee.employeeId == undefined ||
        this.employeeService.employee.employeeId == ""
      ) {
        this.securityService
          .getNewGuid()
          .finally(() => {
            this.spinnerService.hide();
          })
          .subscribe(
            (data: any) => {
              let ret: string = data;
              this.activeEmployeeId = ret;
              this.employeeService.employee.employeeId = ret;
              this.mediaurl =
                APIUrls.MediaImagesEmployeePreview +
                "/" +
                this.activeEmployeeId;
            },
            (error: any) => {
              this.errorMessage = <any>error;
            }
          );
      } else {
        this.activeEmployeeId = this.employeeService.employee.employeeId;
        this.mediaurl =
          APIUrls.MediaImagesEmployeePreview + "/" + this.activeEmployeeId;
      }
    }
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

  moveProfilePictureToServer() {
    //save logo first
    if (this.fileList.fileName != "") {
      let x: any = this.fileList.fileName.split(".");
      if (x.length > 0) {
        this.fileList.employeeFile =
          this.employeeService.employee.employeeId + "." + x[x.length - 1];
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
            this.employeeService.employee.photoName = this.fileList.employeeFile;
            this.submitData();
          },
          (error: any) => {
            this.errorMessage = <any>error;
          }
        );
    } else {
      this.submitData();
    }
  }
}
