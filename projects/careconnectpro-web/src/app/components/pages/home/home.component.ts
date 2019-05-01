import {
  Component,
  ViewEncapsulation,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  ProgressSpinnerService,
  DataService
} from "service-lib";
import { Router } from "@angular/router";
import { LoginComponent } from "../../../components/shared/login/login.component";
import { ModalDirective } from "ngx-bootstrap/modal";
import { UserSession, APIUrls, Message } from "model-lib";
import { BaseComponent } from "../../shared/core/base.component";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
  //encapsulation: ViewEncapsulation.None
})
export class HomeComponent extends BaseComponent implements AfterViewInit {
  title = "Care Connect Pro Software for Home HealthCare Agencies";
  loginControl: LoginComponent;
  loginControl2: any;
  loginModal: ModalDirective;
  shouldShowLoginModal: boolean;
  @ViewChildren("loginModal") modalLoginControls: QueryList<any>;
  isUserLoggedIn: Boolean;
  activeCompanyId: string;
  userSession: UserSession = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private apphtmlcontrol: AppHtmlControlService,
    private spinnerService: ProgressSpinnerService,
    private notifyService: NotificationsService,
    private dataService: DataService
  ) {
    super();
    this.spinnerService.setMessage("Loading main page...");
    this.spinnerService.show();
  }

  ngAfterViewInit() {
    this.spinnerService.setMessage("");
    this.spinnerService.hide();
    this.getLoggedInUserInfo();
  }

  onLoginModalHidden() {
    this.loginControl.Reset();
    this.shouldShowLoginModal = false;
  }

  /**
   * Method - Retrieve logged in user information
   */
  getLoggedInUserInfo() {
    var ret = this.authService.GetSignedInUserInfo().subscribe(
      data => {
        const response: UserSession = data;
        if (response.employeeId === "") {
          this.redirectLogin();
        }
        this.userSession = response;
        this.apphtmlcontrol.loadAppTheme(this.userSession.theme);
        this.notifyService.notify(
          "success",
          "Login Successful",
          "Welcome " + response.fullName
        );
        if (
          !response.fullName ||
          typeof response.fullName === null ||
          typeof response.fullName === "undefined"
        ) {
          this.redirectLogin();
        }
        this.getCompanyInfo(response);
      },
      (error: any) => {
        this.redirectLogin();
        this.logConsoleText(error);
      }
    );
  }

  /**
   * Method - Redirect to login page
   */
  redirectLogin() {
    window.location.href = "/login";
  }

  /**
   * Method - Get information of the current agency
   */
  getCompanyInfo(userSession: UserSession) {
    let ret = this.dataService
      .getSingleData(
        String,
        userSession.companyId,
        APIUrls.CompanyAddressGetPrimaryLocationId
      )
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (!!ret) {
            this.authService.changeActiveAgencyLocationId(ret);
          }
          // Redirect to the application dashboard
          this.router.navigate(["home/dashboard"]);
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.ErrorUnableToRetrieveCompanyPrimaryAddress
          );
        }
      );
  }
}
