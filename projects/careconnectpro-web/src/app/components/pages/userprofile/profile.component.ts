import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  CompanyService,
  CareConnectLocalStorage,
  ProgressSpinnerService,
  AuthService
} from "service-lib";
import "rxjs/add/operator/finally";
import { UserSession } from "model-lib";
import { BaseComponent } from "../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-profile",
  templateUrl: "./profile.component.html"
})
export class UserProfileComponent extends BaseComponent implements OnInit {
  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;

  companySubscriptions = this.companyService.companySubscriptions;
  rootNode: any;
  activeCompanyId: string;
  userSession: UserSession;

  constructor(
    public companyService: CompanyService,
    private localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    private authService: AuthService
  ) {
    super();
    this.title = "User Profile";
    this.spinnerService.setMessage("Loading user profile page...");
    this.spinnerService.show();
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.initComponentData();
  }

  initComponentData() {
    this.activeCompanyId = this.userSession.companyId;
    this.displayUserProfile = true;
    this.displayUserSetting = false;
    this.displayUserAlerts = false;
  }

  ngAfterViewInit() {
    this.spinnerService.setMessage("");
    this.spinnerService.hide();
  }

  //get data for user profile page
  getProfilePage() {
    this.displayUserProfile = true;
    this.displayUserSetting = false;
    this.displayUserAlerts = false;
  }

  //get data for user settings page
  getSettingsPage() {
    this.displayUserProfile = false;
    this.displayUserSetting = true;
    this.displayUserAlerts = false;
  }

  //get data for user alerts page
  getUserAlertsPage() {
    this.displayUserProfile = false;
    this.displayUserSetting = false;
    this.displayUserAlerts = true;
  }
}
