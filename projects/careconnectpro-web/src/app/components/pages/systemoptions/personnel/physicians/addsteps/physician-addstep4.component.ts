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
  PhysicianService
} from "service-lib";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  EditHelperUserAction,
  EditHelperActionType,
  UserSession,
  AppUserType,
  IdentityAppUser,
  MediaFile,
  APIUrls
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "physician-addstep4",
  templateUrl: "./physician-addstep4.component.html"
})
export class OrgPhysicianAddStep4Component implements OnInit, OnChanges {
  appUserTypes: AppUserType[] = [];
  userLogin: IdentityAppUser;
  viewType: SelectItem[];
  activeViewType: string;
  physicianImg: string;
  physicianImgAltText: string;
  activePhysicianId: string;
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

  imguser1: any;
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    private physicianService: PhysicianService,
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
      this.getNewPhysicianGuid();
    } else {
      this.activePhysicianId = this.physicianService.physician.id;
      this.mediaurl =
        APIUrls.MediaImagesPhysicianPreview + "/" + this.activePhysicianId;
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
        this.physicianService.revertPhysicianData();
        break;
      }
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(["/home/personnel", "2"]);
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

  getPhysicianImg(imgName: any): any {
    let imgUrl: any;

    if (imgName != undefined && imgName != "") {
      imgUrl = APIUrls.GetImagePhysician + "/" + imgName;
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
      .mediaImagesPhysicianGetAll(this.physicianService.physician.id)
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
              APIUrls.GetImagePhysicianTemp + "/" + files[0].fileName;
          }
        },
        (error: any) => {
          this.errorMessage = <any>error;
        }
      );
  }

  getNewPhysicianGuid() {
    if (this.physicianService.physician.id === undefined) {
      this.errorMessage = "";
      this.spinnerService.show();
      if (
        this.physicianService.physician.id == null ||
        this.physicianService.physician.id == undefined ||
        this.physicianService.physician.id == ""
      ) {
        this.securityService
          .getNewGuid()
          .finally(() => {
            this.spinnerService.hide();
          })
          .subscribe(
            (data: any) => {
              let ret: string = data;
              this.activePhysicianId = ret;
              this.physicianService.physician.id = ret;
              this.mediaurl =
                APIUrls.MediaImagesPhysicianPreview +
                "/" +
                this.activePhysicianId;
            },
            (error: any) => {
              this.errorMessage = <any>error;
            }
          );
      } else {
        this.activePhysicianId = this.physicianService.physician.id;
        this.mediaurl =
          APIUrls.MediaImagesPhysicianPreview + "/" + this.activePhysicianId;
      }
    }
  }

  displayProfileImage() {
    if (
      this.physicianService.physician.photoName != null &&
      this.physicianService.physician.photoName != "" &&
      this.physicianService.physician.photoName != undefined
    ) {
      this.tempImgFile =
        APIUrls.GetImagePhysician +
        "/" +
        this.physicianService.physician.photoName;
    }
  }

  moveProfilePictureToServer() {
    //save logo first
    if (this.fileList.fileName != "") {
      let x: any = this.fileList.fileName.split(".");
      if (x.length > 0) {
        this.fileList.physicianFile =
          this.physicianService.physician.id + "." + x[x.length - 1];
      } else {
        this.fileList.physicianFile = "";
      }
      this.spinnerService.show();
      this.mediaService
        .mediaImagesPhysicianSave(this.fileList)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          response => {
            // Refresh file list
            this.physicianService.physician.photoName = this.fileList.physicianFile;
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
