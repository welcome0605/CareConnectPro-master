import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserLogin, Message, UserSession } from "model-lib";
import { EmailService, AuthService, NotificationsService } from "service-lib";
import {
  NG_VALIDATORS,
  Validator,
  Validators,
  AbstractControl,
  ValidatorFn,
  NgForm
} from "@angular/forms";
import { EqualValidator } from "../../../../directives/password.match.directive";
import "rxjs/add/operator/finally";
import { Messages } from "primeng/primeng";

@Component({
  selector: "app-resetpwd",
  templateUrl: "./resetpwd.component.html",
  styleUrls: ["./resetpwd.component.css"]
})
export class ResetpwdComponent implements OnInit {
  password2: string = "";
  userLogin: UserLogin;
  isPasswordError: boolean = false;
  errorMsg: string = "";
  isLoading: boolean = false;
  disableSubmit: boolean = false;
  userSession: UserSession;

  logolighticon = require("../../../../../assets/images/logo-light-icon2.png");

  constructor(
    private activeRoute: ActivatedRoute,
    private emailService: EmailService,
    public authService: AuthService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.parseUrlQuery();
  }

  VerifyPasswordRequestToken() {
    this.clearError();
    let ret = this.authService
      .VerifyPasswordResetToken(this.userLogin.token)
      .subscribe(
        (data: any) => {
          let x: string = data;
          if (x === "") {
            this.disableSubmit = false;
          } else {
            this.isPasswordError = true;
            this.errorMsg = x;
            this.disableSubmit = true;
          }
        },
        (error: any) => {
          this.isPasswordError = true;
          this.errorMsg = Message.VerifyResetPasswordTokenFailed;
          this.disableSubmit = true;
          this.notificationsService.notify(
            "error",
            "Message Center",
            Message.VerifyResetPasswordTokenFailed
          );
        }
      );
  }

  clearError() {
    this.disableSubmit = false;
    this.isPasswordError = false;
  }

  changePassword() {
    this.clearError();
    this.isLoading = true;
    let ret = this.authService
      .ChangeUserPassword(this.userLogin)
      .finally(() => {
        this.isLoading = false;
      })
      .subscribe(
        (data: any) => {
          let x: boolean = data;
          if (x) {
            this.notificationsService.notify(
              "success",
              "Message Center",
              Message.ResetPasswordSuccess
            );
            this.clearErrorMsg();
            this.cancel();
          } else {
            this.errorMsg = Message.ResetPasswordFailed;
            this.isPasswordError = true;
          }
        },
        (error: any) => {
          this.isPasswordError = true;
          this.errorMsg = Message.ResetPasswordFailed;
          this.notificationsService.notify(
            "error",
            "Message Center",
            Message.ResetPasswordFailed
          );
        }
      );
  }

  clearErrorMsg() {
    this.isPasswordError = false;
    this.errorMsg = "";
    this.isLoading = false;
  }

  submitForm() {
    this.clearErrorMsg();
    if (this.userLogin.password === this.password2) {
      this.changePassword();
    }
  }

  cancel() {
    window.location.href = "/login";
  }

  parseUrlQuery() {
    this.activeRoute.params.subscribe(parms => {
      const tmpToken: string = parms["token"];

      if (tmpToken != null) {
        this.userLogin.token = tmpToken;
        this.VerifyPasswordRequestToken();
      }
    });
  }
}
