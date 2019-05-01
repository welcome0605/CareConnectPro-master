import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  CareConnectLocalStorage,
  AlertService,
  ProgressSpinnerService,
  MediaService,
  PhysicianService
} from "service-lib";
import { Router } from "@angular/router";
import {
  IdentityAppUser,
  UserSession,
  Physician,
  PhysicianPracticeArea,
  AppUserType,
  AppRole,
  APIUrls
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "app-physician",
  templateUrl: "./physicians.component.html"
})
export class OrgPhysicianComponent implements OnInit {
  physicians: Physician[];
  tempPractice: string;
  physician: Physician;
  physicianPractice: any;
  physicianPractices: PhysicianPracticeArea[];
  isNewPractice: boolean = true;
  disableAddPracticeBtn: boolean = true;
  disableDeletePracticeBtn: boolean = true;
  physicianPracticesSelect: SelectItem[];
  selectedPhysicianPractice: string;
  appUser: IdentityAppUser;
  viewType: SelectItem[];
  activeViewType: string;
  activePhysicianId: string;
  isLoading: boolean = false;
  appUserTypes: AppUserType[] = [];
  selectedPhysician: Physician;
  tempImgFile: string = "";
  term;
  userLogin: IdentityAppUser;
  appRoles: AppRole[] = [];
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  displayDialogEmployee: boolean;
  activeCompanyId: string;
  imguser1: any;
  type = "physician";
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private physicianService: PhysicianService,
    private alertService: AlertService,
    private mediaService: MediaService,
    private spinnerService: ProgressSpinnerService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.getAllPhysicians();
    this.populateViewType();
    this.physicianService.physician.isActive = true;
  }

  private populateViewType() {
    let x: string[] = ["All", "Active Physicians", "InActive Physicians"];
    this.viewType = [
      { label: "All Physicians", value: "All" },
      { label: "Active Physicians", value: "Active" },
      { label: "InActive Physicians", value: "Inactive" }
    ];
    this.activeViewType = "All";
  }

  private getAllPhysicians() {
    this.spinnerService.show();
    let ret = this.physicianService
      .getAllPhysicians(this.activeCompanyId)
      .finally((data: any) => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          console.log(data);
          let ret: Physician[] = data;
          this.physicians = ret;
          this.physicianService.allphysicians = ret;
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.spinnerService.hide();
          this.alertService.error(
            "Unable to read physicians. Please contact Care Connect Pro service desk"
          );
          //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
        }
      );
  }

  public getPhysicianView() {
    let x: any = this.activeViewType;
    switch (x) {
      case "All": {
        this.getAllPhysicians();
        break;
      }
      case "Active": {
        this.getActivePhysicians();
        break;
      }
      case "Inactive": {
        this.getInActivePhysicians();
        break;
      }
    }
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

  RouteNewPhysician() {
    this.physicianService.initData();
    this.router.navigate(["/home/personnel/physician/add"]);
  }

  private getActivePhysicians() {
    this.spinnerService.show();
    let ret = this.physicianService
      .getActivePhysicians(this.activeCompanyId)
      .finally((data: any) => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Physician[] = data;
          this.physicians = ret;
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.spinnerService.hide();
          this.alertService.error(
            "Unable to read physicians. Please contact Care Connect Pro service desk"
          );
          //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
        }
      );
  }

  private getInActivePhysicians() {
    this.spinnerService.show();
    let ret = this.physicianService
      .getInActivePhysicians(this.activeCompanyId)
      .finally((data: any) => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Physician[] = data;
          this.physicians = ret;
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.spinnerService.hide();
          this.alertService.error(
            "Unable to read physicians. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  public changeSortPhysician(event: any) {
    if (!event.order) {
      this.sortF = "name";
    } else {
      this.sortF = event.field;
    }
  }

  onRowSelectPhysician(event: any) {
    this.physicianService.isNewPhysician = false;
    this.physicianService.physician = this.clonePhysician(event.data);
    this.router.navigate(["/home/personnel/physician/detail"]);
  }

  private clonePhysician(a: Physician): Physician {
    let physician: any;
    let y: any = a;
    for (let prop in a) {
      physician[prop] = y[prop];
    }
    return physician;
  }

  private findSelectedPhysicianIndex(): number {
    return this.physicians.indexOf(this.selectedPhysician);
  }

  displayAddPhysicianView() {
    this.physicianService.initData();
    this.physicianService.isNewPhysician = true;
    this.physicianService.physician.isActive = true;
    this.displayProfileImage();
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
}
