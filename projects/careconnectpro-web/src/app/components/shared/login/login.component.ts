import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, takeUntil } from "rxjs/operators";
import "rxjs/add/operator/finally";
import {
  UserLogin,
  UserSession,
  CompanySystemSettings,
  Message,
  ResetPasswordMessage,
  MessageStatus,
  APIUrls
} from "model-lib";
import {
  NotificationsService,
  AuthService,
  AppHtmlControlService,
  AlertService,
  ProgressSpinnerService,
  CompanyService,
  CareConnectLocalStorage,
  SecurityService,
  EmailService,
  DataService
} from "service-lib";
import * as $ from "jquery";
import { BaseComponent } from "../core";
// import * as bootstrap from 'bootstrap';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
  userLogin: UserLogin;
  isLoading = false;
  formResetToggle = true;
  modalClosedCallback: () => void;
  loginStatusSubscription: any;
  tempdata: any;
  SkipLoginValue: string;
  resetPasswordSent: boolean = false;
  resetEmailDoesNotExist: boolean = false;
  resetPasswordMessage: ResetPasswordMessage;
  messageStatus: MessageStatus = {};
  errorMsg: string = "";
  isPasswordResetError: boolean = false;
  webServerUrl: string = APIUrls.GetWebAppRootUrl;

  @Input() isModal = false;

  img1 = require("../../../../assets/images/CareConnectPro_Final.png");
  img2 = require("../../../../assets/images/laptop.png");

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    private notifyService: NotificationsService,
    private alertService: AlertService,
    private localStore: CareConnectLocalStorage,
    private securityService: SecurityService,
    private emailService: EmailService,
    private dataService: DataService
  ) {
    super();
  }

  ResetPasswordClicked() {
    this.userLogin.resetPasswordEmail = "";
    this.clearResetError();
  }

  initMessageStatus() {
    this.messageStatus.isSuccessful = false;
    this.messageStatus.resultText = "";
  }

  GetMessageTemplate(): string {
    const msg: string = `<div class="PlainText">Hello!<br><br>
      We've generated a URL to <span data-markjs="true" class="markclgluv583" style="background-color: yellow; color: black;">reset</span>
      your <span data-markjs="true" class="marktbxpr3yxk" style="background-color: yellow; color: black;">password</span>.
      If you did not request to <span data-markjs="true" class="markclgluv583" style="background-color: yellow; color: black;">
      reset</span> your <span data-markjs="true" class="marktbxpr3yxk" style="background-color: yellow; color: black;">password</span>
      or if you've changed your mind, simply ignore this email and nothing will happen.<br>
      You can reset your password by clicking the following URL: <br>
      <a href="${
        this.webServerUrl
      }/login/resetpwd/{{ccptoken}}" target = "_blank" rel = "noopener noreferrer" data - auth="NotApplicable">
      ${this.webServerUrl}/login/resetpwd/{{ccptoken}} </a><br>
      <br>
      If clicking the URL above does not work, copy and paste the URL into a browser window.The URL will only be valid for a limited time and will expire.
      <br>
      <br>
      Thank you, <br>
      <br>
      CareConnectPro Support
      <br>
      <a href="${
        this.webServerUrl
      }" target = "_blank" rel = "noopener noreferrer" data - auth="NotApplicable"> ${
      this.webServerUrl
    }/support</a><br>
    </div>`;
    return msg;
  }

  GetResetPasswordToken() {
    let ret = this.authService.GetResetPasswordToken(this.userLogin).subscribe(
      (data: any) => {
        let x: UserLogin = data;
        if (x != null) {
          this.userLogin.token = x.token;
          this.GenerateResetPasswordEmail();
        }
      },
      (error: any) => {
        this.messageStatus.isSuccessful = false;
        this.isPasswordResetError = true;
        this.errorMsg = Message.SendMessageFailedGeneralError;
        this.notifyService.notify(
          "error",
          "Message Center",
          Message.SendMessageFailedGeneralError
        );
      }
    );
  }

  GenerateResetPasswordEmail() {
    this.resetPasswordMessage.email = this.userLogin.resetPasswordEmail;
    this.resetPasswordMessage.msgContent = this.GetMessageTemplate();
    this.resetPasswordMessage.subject = Message.ResetEmailSubject;
    this.resetPasswordMessage.token = this.userLogin.token;
    let ret = this.emailService
      .sendMessage(this.resetPasswordMessage)
      .subscribe(
        (data: any) => {
          let x: any = data;
          this.messageStatus.isSuccessful = true;
          this.hideResetPasswordModalWindow();
          this.notifyService.notify(
            "success",
            "Message Center",
            Message.ResetEmailSentCheckEmail
          );
        },
        (error: any) => {
          this.messageStatus.isSuccessful = false;
          this.isPasswordResetError = true;
          this.errorMsg = Message.SendMessageFailedGeneralError;
          this.notifyService.notify(
            "error",
            "Message Center",
            Message.SendMessageFailedGeneralError
          );
        }
      );
  }

  hideResetPasswordModalWindow() {
    this.CloseModal();
    $(function() {
      $("#demoresetpwdModal").modal("hide");
    });
  }

  clearResetError() {
    this.resetEmailDoesNotExist = false;
    this.messageStatus.isSuccessful = false;
    this.errorMsg = "";
    this.isPasswordResetError = false;
  }

  login() {
    window.location.href = "/login";
  }

  public VerifyResetAccount() {
    this.clearResetError();
    this.isLoading = true;
    let ret = this.securityService
      .validateUserNameExist(this.userLogin.resetPasswordEmail)
      .finally(() => {
        this.isLoading = false;
      })
      .subscribe(
        (data: any) => {
          let ret: boolean = data;
          if (ret) {
            this.GetResetPasswordToken();
          } else {
            this.resetEmailDoesNotExist = true;
          }
        },
        (error: any) => {
          this.messageStatus.isSuccessful = false;
          this.errorMsg = Message.SendMessageFailedGeneralError;
          this.isPasswordResetError = true;
          this.notifyService.notify(
            "error",
            "Message Center",
            Message.SendMessageFailedGeneralError
          );
        }
      );
  }

  ngOnInit() {
    this.userLogin = {};
    this.initMessageStatus();
  }

  ShowAlertDialog() {
    this.alertService.error("Error message");
  }

  ngOnDestroy() {
    if (this.loginStatusSubscription)
      this.loginStatusSubscription.unsubscribe();
  }

  CloseModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }

  /**
   * Method - Handle user login - call api
   */
  Login() {
    this.alertService.clear();
    this.isLoading = true;
    let ret = this.authService
      .login(this.userLogin)
      .finally(() => {
        this.isLoading = false;
      })
      .subscribe(
        data => {
          this.isLoading = false;
          let response: UserSession = data;
          if (response.isAuthenticated) {
            this.localStore.setLoginTheme(response.theme);
            this.isLoading = false;
            // Redirect to the application dashboard
            window.location.href = "/home";
          } else {
            this.errorMsg = Message.LoginFailedUserOrPasswordIncorrect;
            this.alertService.error(this.errorMsg);
          }
        },
        (error: any) => {
          this.errorMsg = Message.LoginFailedUserOrPasswordIncorrect;
          this.alertService.error(this.errorMsg);
        }
      );
  }

  Reset() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;
    });
  }

  Signup() {
    this.router.navigate(["/signup"]);
  }
}
