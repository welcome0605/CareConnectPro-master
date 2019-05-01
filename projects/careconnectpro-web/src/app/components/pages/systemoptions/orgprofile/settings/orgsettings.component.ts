import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  SimpleChanges,
  EventEmitter,
  ViewChild
} from "@angular/core";
import {
  CompanyService,
  NotificationsService,
  MediaService,
  CareConnectLocalStorage,
  AppHtmlControlService,
  ProgressSpinnerService,
  AlertService,
  AuthService
} from "service-lib";
import {
  Company,
  CompanySystemSettings,
  APIUrls,
  MediaFile,
  UserLogin,
  UserSession
} from "model-lib";
import "rxjs/add/operator/finally";
import {
  NG_VALIDATORS,
  Validator,
  Validators,
  AbstractControl,
  ValidatorFn,
  NgForm
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-orgsettings",
  templateUrl: "./orgsettings.component.html"
})
export class OrgSettingsComponent implements OnInit {
  title: string;
  subtitle: string;
  displaySubRenewal: boolean;
  companyInfo: Company;
  userSession: UserSession;

  companySettings: CompanySystemSettings = {
    id: "",
    companyId: "",
    logo: "",
    logoName: "",
    defaultTheme: "",
    enableChat: false,
    enableUserTheme: false,
    enableMessages: false,
    enableBroadcastMsgs: false,
    lastUpdatedUserId: "",
    dateCreated: new Date(),
    lastUpdatedDate: new Date()
  };
  @ViewChild("f1") f1: NgForm;
  saveStatus1: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("f2") f2: NgForm;
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  @ViewChild("f3") f3: NgForm;
  saveStatus3: EventEmitter<boolean> = new EventEmitter();

  rootNode: any;
  companyLogos: any[] = [];

  isEditMode1: boolean;
  isEditMode2: boolean;
  isEditMode3: boolean;

  activeCompanyId: string;
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;

  sortF2: any;
  fileList: MediaFile = {
    fileName: "",
    filePath: "",
    companyFile: "",
    employeeFile: "",
    physicianFile: "",
    vendorFile: ""
  };
  errorMessage: string;

  tempImgFile: string = "";
  imguser1: any;

  mediaurl: string;

  imguserbig1 = require("../../../../../../assets/plugins/dropify/src/images/test-image-1.jpg");
  companylogo1 = require("../../../../../../assets/plugins/dropify/src/images/test-image-1.jpg");

  constructor(
    public companyService: CompanyService,
    private notifyservice: NotificationsService,
    public localstore: CareConnectLocalStorage,
    private mediaSvc: MediaService,
    private appHtmlControl: AppHtmlControlService,
    private spinnerService: ProgressSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService
  ) {
    this.title = "Organization Settings";
    this.subtitle = "This is some text within a card block.";
    this.imguser1 = this.mediaSvc.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.mediaurl =
      APIUrls.MediaImagesCompanyPreview + "/" + this.activeCompanyId;
    this.getCompanySettings();

    if (this.companySettings == null || this.companySettings == undefined) {
      this.initCompanySettings();
    }

    this.isEditMode1 = false;
    this.isEditMode2 = false;
    this.isEditMode3 = false;

    this.appHtmlControl.enableThemeSwitcher();
  }

  saveChanges1(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode1 = true;
        break;
      }
      case 4:
      case 2: {
        this.f1.ngSubmit.emit();
        if (this.f1.form.valid === false) {
          this.saveStatus1.emit(false);
          this.isEditMode1 = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode1();
        this.getCompanySettings();
        break;
      }
    }
  }

  saveUpdate1() {
    this.saveStatus1.emit(true);
    this.updateSettings();
  }

  saveChanges2(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode3 = true;
        break;
      }
      case 4:
      case 2: {
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus2.emit(false);
          this.isEditMode2 = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode2();
        this.getCompanySettings();
        break;
      }
    }
  }

  saveUpdate2() {
    this.saveStatus2.emit(true);
    this.updateSettings();
  }

  saveChanges3(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode3 = true;
        break;
      }
      case 4:
      case 2: {
        this.f3.ngSubmit.emit();
        if (this.f3.form.valid === false) {
          this.saveStatus3.emit(false);
          this.isEditMode3 = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode3();
        this.getCompanySettings();
        break;
      }
    }
  }

  saveUpdate3() {
    this.saveStatus3.emit(true);
    this.updateSettings();
  }

  cancelEditMode1() {
    this.isEditMode1 = false;
  }

  cancelEditMode2() {
    this.isEditMode2 = false;
  }

  cancelEditMode3() {
    this.isEditMode3 = false;
  }

  //get data for settings page
  getSettingsPage() {
    this.appHtmlControl.loadAppTheme(this.companySettings.defaultTheme);

    if (this.companySettings == null || this.companySettings == undefined) {
      this.initCompanySettings();
    }

    if (this.companySettings != null) {
      if (
        this.companySettings.logoName != "" &&
        this.companySettings.logoName != null &&
        this.companySettings.logoName != "undefined"
      ) {
        this.tempImgFile =
          APIUrls.GetImageCompany + "/" + this.companySettings.logoName;
      }
    }
  }

  getCompanyImg(): any {
    let imgUrl: any;

    if (this.tempImgFile != undefined && this.tempImgFile != "") {
      imgUrl = this.tempImgFile;
    } else {
      imgUrl = this.imguser1;
    }
    return imgUrl;
  }

  getCompanySettings() {
    this.spinnerService.show();
    let ret = this.companyService
      .getCompanySettingsById(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          this.companySettings = data;
          if (
            this.companySettings == null ||
            this.companySettings == undefined
          ) {
            this.initCompanySettings();
          }
          this.getSettingsPage();
        },
        (error: any) => {
          console.log(
            "OrgProfile Init - Error retrieving your company information. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  initCompanySettings() {
    this.companySettings = {
      id: "",
      companyId: "",
      logo: "",
      logoName: "",
      defaultTheme: "",
      enableChat: false,
      enableUserTheme: false,
      enableMessages: false,
      enableBroadcastMsgs: false,
      lastUpdatedUserId: "",
      dateCreated: new Date(),
      lastUpdatedDate: new Date()
    };
  }

  uploadLogo(event: any) {
    for (let file of event.files) {
      this.companyLogos.push(file);
    }
  }

  updateSettingsDb() {
    this.companySettings.defaultTheme = this.localstore.getActiveTheme();
    this.companySettings.companyId = this.activeCompanyId;
    this.spinnerService.show();

    //add new company settings if it doesn't exist
    if (this.companySettings.id == null || this.companySettings.id == "") {
      //this.initCompanySettings();
      let ret = this.companyService
        .addSystemSettings(this.companySettings)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let x: any = data;
            this.companySettings = x;
            //get current login token and update it
            this.userSession.theme = this.companySettings.defaultTheme;
            this.userSession.companyLogoName = this.companySettings.logoName;
            this.authService.setUserLoggedIn(this.userSession);

            this.notifyservice.notify(
              "success",
              "Company Profile",
              "Settings updated successfully"
            );
            window.location.href = "/app/orgprofile";
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
    } else {
      this.spinnerService.show();
      let ret = this.companyService
        .updateSystemSettings(this.companySettings)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let x: any = data;
            if (x) {
              //get current login token and update it
              this.userSession.theme = this.companySettings.defaultTheme;
              this.userSession.companyLogoName = this.companySettings.logoName;
              this.authService.setUserLoggedIn(this.userSession);
              this.notifyservice.notify(
                "success",
                "Company Profile",
                "Settings updated successfully"
              );
            }
            window.location.href = "/app/orgprofile";
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

  updateSettings() {
    //save logo first
    if (this.fileList.fileName != "") {
      let x: any = this.fileList.fileName.split(".");
      if (x.length > 1) {
        this.fileList.companyFile = x[x.length - 2] + "." + x[x.length - 1];
      } else {
        this.fileList.companyFile = "";
      }
      this.spinnerService.show();
      this.mediaSvc
        .mediaImagesCompanySave(this.fileList)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          response => {
            // Refresh file list
            this.companySettings.logoName = this.fileList.companyFile;
            this.tempImgFile = "logos/" + this.fileList.companyFile;
            this.companyService.companyLogo = this.tempImgFile;
            this.companyService.saveCompanyLogo(this.tempImgFile);
            this.appHtmlControl.updateUserProfileBg(this.fileList.companyFile);
            console.log("logo updated");
            this.updateSettingsDb();
          },
          error => (this.errorMessage = <any>error)
        );
    } else {
      this.updateSettingsDb();
    }
  }

  public getFiles() {
    this.errorMessage = "";
    this.spinnerService.show();
    this.mediaSvc
      .mediaImagesCompanyGetAll(this.activeCompanyId)
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
              APIUrls.GetImageCompanyTemp + "/" + files[0].fileName;
          }
        },
        (error: any) => (this.errorMessage = <any>error)
      );
  }

  public onUpload(event: any) {
    this.getFiles();
  }

  public deleteFile(file: MediaFile) {
    this.spinnerService.show();
    // Call the service
    this.mediaSvc
      .mediaImagesCompanyDelete(file)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        response => {
          // Refresh file list
          this.getFiles();
        },
        error => (this.errorMessage = <any>error)
      );
  }
}
