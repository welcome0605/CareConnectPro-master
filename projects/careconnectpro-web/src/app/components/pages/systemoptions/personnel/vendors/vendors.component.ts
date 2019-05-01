import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  CareConnectLocalStorage,
  AlertService,
  ProgressSpinnerService,
  MediaService,
  VendorService
} from "service-lib";
import { Router } from "@angular/router";
import {
  IdentityAppUser,
  VendorBusinessService,
  UserSession,
  Vendor,
  AppUserType,
  AppRole,
  APIUrls
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "app-vendor",
  templateUrl: "./vendors.component.html"
})
export class OrgVendorComponent implements OnInit {
  vendors: Vendor[];
  tempPractice: string;
  vendor: Vendor = {};
  vendorBusinessService: any;
  vendorBusinessServices: VendorBusinessService[];
  selectedVendorService: string;
  appUser: IdentityAppUser = {};
  viewType: SelectItem[];
  activeViewType: string;
  activeVendorId: string;
  isLoading: boolean = false;
  appUserTypes: AppUserType[] = [];
  selectedVendor: Vendor;
  tempImgFile: string = "";
  term;

  userLogin: IdentityAppUser = {};
  appRoles: AppRole[] = [];

  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  activeCompanyId: string;
  imguser1: any;
  userSession: UserSession = {};

  type = "vendor";
  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private vendorService: VendorService,
    private alertService: AlertService,
    private mediaService: MediaService,
    private spinnerService: ProgressSpinnerService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.getAllVendors();
    this.populateViewType();
    this.vendorService.vendor.isActive = true;
  }

  private populateViewType() {
    let x: string[] = ["All", "Active Vendors", "InActive Vendors"];
    this.viewType = [
      { label: "All Vendors", value: "All" },
      { label: "Active Vendors", value: "Active" },
      { label: "InActive Vendors", value: "Inactive" }
    ];
    this.activeViewType = "All";
  }

  private getAllVendors() {
    this.spinnerService.show();
    let ret = this.vendorService
      .getAllVendors(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Vendor[] = data;
          this.vendors = ret;
          this.vendorService.allvendors = ret;
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read vendors. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  public getVendorView() {
    let x: any = this.activeViewType;
    switch (x) {
      case "All": {
        this.getAllVendors();
        break;
      }
      case "Active": {
        this.getActiveVendors();
        break;
      }
      case "Inactive": {
        this.getInActiveVendors();
        break;
      }
    }
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

  RouteNewVendor() {
    this.vendorService.initData();
    this.router.navigate(["/home/personnel/vendor/add"]);
  }

  private getActiveVendors() {
    this.spinnerService.show();
    let ret = this.vendorService
      .getActiveVendors(this.activeCompanyId)
      .finally((data: any) => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Vendor[] = data;
          this.vendors = ret;
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.spinnerService.hide();
          this.alertService.error(
            "Unable to read vendors. Please contact Care Connect Pro service desk"
          );
          //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
        }
      );
  }

  private getInActiveVendors() {
    this.spinnerService.show();
    let ret = this.vendorService
      .getInActiveVendors(this.activeCompanyId)
      .finally((data: any) => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Vendor[] = data;
          this.vendors = ret;
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.spinnerService.hide();
          this.alertService.error(
            "Unable to read vendors. Please contact Care Connect Pro service desk"
          );
          //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
        }
      );
  }

  public changeSortVendor(event: any) {
    if (!event.order) {
      this.sortF = "name";
    } else {
      this.sortF = event.field;
    }
  }

  onRowSelectVendor(event: any) {
    this.vendorService.isNewVendor = false;
    this.vendorService.vendor = this.cloneVendor(event.data);
    this.router.navigate(["/home/personnel/vendor/detail"]);
  }

  private cloneVendor(a: Vendor): Vendor {
    let vendor: any;
    let y: any = a;
    for (let prop in a) {
      vendor[prop] = y[prop];
    }
    return vendor;
  }

  private findSelectedVendorIndex(): number {
    return this.vendors.indexOf(this.selectedVendor);
  }

  displayAddVendorView() {
    this.vendorService.initData();
    this.vendorService.isNewVendor = true;
    this.vendorService.vendor.isActive = true;
    this.displayProfileImage();
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
}
