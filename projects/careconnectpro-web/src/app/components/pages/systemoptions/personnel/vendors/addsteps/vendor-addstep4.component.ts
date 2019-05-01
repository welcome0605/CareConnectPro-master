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
  SecurityService,
  ProgressSpinnerService,
  MediaService,
  VendorService
} from "service-lib";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  EditHelperUserAction,
  EditHelperActionType,
  IdentityAppUser,
  UserSession,
  AppUserType,
  MediaFile,
  APIUrls
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "vendor-addstep4",
  templateUrl: "./vendor-addstep4.component.html"
})
export class OrgVendorAddStep4Component implements OnInit, OnChanges {
  appUserTypes: AppUserType[] = [];
  userLogin: IdentityAppUser;
  viewType: SelectItem[];
  activeViewType: string;
  vendorImg: string;
  vendorImgAltText: string;
  activeVendorId: string;
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
    private vendorService: VendorService,
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
    this.getMediaUrl();
  }

  getMediaUrl() {
    if (this.isNewRecord === true) {
      this.getNewVendorGuid();
    } else {
      this.activeVendorId = this.vendorService.vendor.id;
      this.mediaurl =
        APIUrls.MediaImagesVendorPreview + "/" + this.activeVendorId;
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
        this.vendorService.revertVendorData();
        break;
      }
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(["/home/personnel", "3"]);
  }

  submitForm() {
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

  getVendorImg(imgName: any): any {
    let imgUrl: any;

    if (imgName != undefined && imgName != "") {
      imgUrl = APIUrls.GetImageVendor + "/" + imgName;
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
      .mediaImagesVendorGetAll(this.vendorService.vendor.id)
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
              APIUrls.GetImageVendorTemp + "/" + files[0].fileName;
          }
        },
        (error: any) => {
          this.errorMessage = <any>error;
        }
      );
  }

  getNewVendorGuid() {
    if (this.vendorService.vendor.id === undefined) {
      this.errorMessage = "";
      this.spinnerService.show();
      if (
        this.vendorService.vendor.id == null ||
        this.vendorService.vendor.id == undefined ||
        this.vendorService.vendor.id == ""
      ) {
        this.securityService
          .getNewGuid()
          .finally(() => {
            this.spinnerService.hide();
          })
          .subscribe(
            (data: any) => {
              let ret: string = data;
              this.activeVendorId = ret;
              this.vendorService.vendor.id = ret;
              this.mediaurl =
                APIUrls.MediaImagesVendorPreview + "/" + this.activeVendorId;
            },
            (error: any) => {
              this.errorMessage = <any>error;
            }
          );
      } else {
        this.activeVendorId = this.vendorService.vendor.id;
        this.mediaurl =
          APIUrls.MediaImagesVendorPreview + "/" + this.activeVendorId;
      }
    }
  }

  displayProfileImage() {
    if (
      this.vendorService.vendor.photoName != null &&
      this.vendorService.vendor.photoName != "" &&
      this.vendorService.vendor.photoName != undefined
    ) {
      this.tempImgFile =
        APIUrls.GetImageVendor + "/" + this.vendorService.vendor.photoName;
    }
  }

  moveProfilePictureToServer() {
    //save logo first
    if (this.fileList.fileName != "") {
      let x: any = this.fileList.fileName.split(".");
      if (x.length > 0) {
        this.fileList.vendorFile =
          this.vendorService.vendor.id + "." + x[x.length - 1];
      } else {
        this.fileList.vendorFile = "";
      }
      this.spinnerService.show();
      this.mediaService
        .mediaImagesVendorSave(this.fileList)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          response => {
            // Refresh file list
            this.vendorService.vendor.photoName = this.fileList.vendorFile;
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
