import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  CareConnectLocalStorage,
  CompanyService,
  MediaService
} from "service-lib";
import { Router, NavigationExtras } from "@angular/router";
import { UserLogin, UserSession, APIUrls } from "model-lib";
import { BaseComponent } from "../core";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "ma-sidebar",
  templateUrl: "./sidebar.component.html"
})
export class SidebarComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  imguser1 = require("../../../../assets/images/logo-light-icon.png");

  loginToken: UserLogin = {};
  currentUser: any;
  currFullName: string;
  compLogo: any;
  bgSize: string;
  imgSrc: any;
  imgAltText: string = "";
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    private localstore: CareConnectLocalStorage,
    public companyService: CompanyService,
    private mediaSvc: MediaService
  ) {
    super();
  }

  ngOnInit() {
    this.getLoggedInUserInfo();
  }

  initComponentData() {
    this.userSession = this.authService.getUserLoggedIn();

    this.currFullName = this.userSession ? this.userSession.fullName : "";

    if (
      this.userSession.companyLogoName !== undefined &&
      this.userSession.companyLogoName !== null &&
      this.userSession.companyLogoName !== ""
    ) {
      this.compLogo =
        "url(" +
        APIUrls.GetImageCompany +
        "/" +
        this.userSession.companyLogoName +
        ")";
    } else {
      this.compLogo =
        "url(" + "../../../../../../assets/images/defaultcompanylogo.jpg" + ")";
    }
    this.bgSize = "100%";

    if (
      this.userSession.employeePhotoName != undefined &&
      this.userSession.employeePhotoName !== null &&
      this.userSession.employeePhotoName !== ""
    ) {
      this.imgSrc =
        APIUrls.GetImageEmployee + "/" + this.userSession.employeePhotoName;

      this.imgAltText = this.currFullName + "profile pic";
    } else {
      this.imgSrc = "../../../../../../assets/images/defaultuserlogo.png";
      this.imgAltText = "CareConnect User";
    }
  }

  ngAfterViewInit() {}

  logout() {
    this.authService.logout();
  }

  getLoggedInUserInfo() {
    this.authService.userSessionSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.userSession = data;
        this.apphtmlcontrol.loadAppTheme(this.userSession.theme);
        this.initComponentData();
      });
  }
}
