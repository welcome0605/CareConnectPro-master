import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Http, Response, Headers } from "@angular/http";
import { Router, NavigationExtras } from "@angular/router";
import "rxjs/add/operator/map";
import {
  APIUrls,
  UserSignup,
  SignupResponse,
  UserLogin,
  UserSession
} from "model-lib";
import { NotificationsService } from "./notifications.service";
import { CareConnectLocalStorage } from "./localstorage.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isLoggedIn = false;
  private showSignup = false;
  private userLoggedIn: UserLogin;
  private activeLocationId: string;
  public activeLocationId$: Subject<string> = new Subject<string>();
  private userSession: UserSession;
  public userSessionSubject: Subject<UserSession>;

  constructor(
    public router: Router,
    private http: Http,
    private notificationsService: NotificationsService,
    private localStore: CareConnectLocalStorage
  ) {
    this.userSessionSubject = new Subject<UserSession>();
  }

  setUserLoggedIn(val: UserSession) {
    this.userSession = val;
  }

  /**
   * Method - Update the current agency location id
   */
  changeActiveAgencyLocationId(locationId: string) {
    this.activeLocationId = locationId;
    this.activeLocationId$.next(locationId);
  }

  /**
   * Method - Retrieve stored agency location id
   */
  getActiveAgencyLocationId(): string {
    return this.activeLocationId;
  }

  getUserLoggedIn() {
    return this.userSession;
  }

  login(user: UserLogin) {
    var userJson = JSON.stringify(user);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(APIUrls.AccountLoginUser, userJson, { headers: headers })
      .pipe(
        map((ret: Response) => {
          var user = <UserSession>ret.json();
          this.userSession = user;
          this.isLoggedIn = user.isAuthenticated;
          // store username token in local storage to keep user logged in between page refreshes
          this.localStore.storeUserSession(this.userSession.sessionId);
          this.setUserLoggedIn(user);
          return user;
        }),
        catchError(e => {
          return Observable.throw(e);
        })
      );
  }

  VerifyUserSessionExpired(sessionId: string): any {
    return this.http.get(APIUrls.VerifyUserSession + "/" + sessionId).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((e: any) => {
        return JSON.stringify(true);
      })
    );
  }

  ExtendSession(sessionId: string): any {
    return this.http.get(APIUrls.ExtendUserSession + "/" + sessionId).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((e: any) => {
        return Observable.throw(e);
      })
    );
  }

  /**
   * Method - Get profile of user currently logged on
   */
  GetSignedInUserInfo(): any {
    const sessionId = this.localStore.getUserSession();
    return this.http.get(APIUrls.GetUserSignedInInfo + "/" + sessionId).pipe(
      map((ret: Response) => {
        var user = <UserSession>ret.json();
        this.userSession = user;
        this.localStore.setLoginTheme(this.userSession.theme);
        this.userSessionSubject.next(user);
        return user;
      }),
      catchError((e: any) => {
        return Observable.throw(e);
      })
    );
  }

  /**
   * Method - Reset Password token
   * @param user
   */
  GetResetPasswordToken(user: UserLogin): any {
    return this.http
      .get(APIUrls.GetChangePasswordToken + "/" + user.resetPasswordEmail)
      .pipe(
        map((ret: Response) => {
          return ret.json();
        }),
        catchError((e: any) => {
          return Observable.throw(e);
        })
      );
  }

  VerifyPasswordResetToken(tokenId: string): any {
    return this.http
      .get(APIUrls.VerifyPasswordRequestToken + "/" + tokenId)
      .pipe(
        map((ret: Response) => {
          return ret.json();
        }),
        catchError((e: any) => {
          return Observable.throw(e);
        })
      );
  }

  ChangeUserPassword(user: UserLogin): any {
    var userJson = JSON.stringify(user);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.ChangeUserPassword, userJson, { headers: headers })
      .pipe(
        map((ret: Response) => {
          return ret.json();
        }),
        catchError(e => {
          return Observable.throw(e);
        })
      );
  }

  logout(): void {
    //logoff the user and CCP values in local storage
    this.isLoggedIn = false;
    let tmpUserLogin: UserLogin = {};
    this.localStore.setLoginToken(tmpUserLogin);
    this.localStore.storeUserSession("");

    this.router.navigateByUrl("/login");
    this.notificationsService.notify("success", "Logout Succesful", "");
  }

  registerCompany(companyinfo: UserSignup) {
    var params = {
      AppUserId: "",
      firstname: companyinfo.firstname,
      lastname: companyinfo.lastname,
      email: companyinfo.useremail,
      phone: companyinfo.userphone,
      companyname: companyinfo.company,
      jobtitle: companyinfo.jobtitle,
      username: companyinfo.username,
      password: companyinfo.password1
    };
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling register http");

    return this.http
      .post(APIUrls.AccountRegisterCompany, JSON.stringify(params), {
        headers: headers
      })
      .pipe(
        map((ret: Response) => {
          console.log("Service returned register OK");
          var acct = <SignupResponse>ret.json();
          return acct;
        }),
        catchError(e => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  isUserLogin(res: boolean) {
    this.isLoggedIn = res;
  }

  isShowSignup(val: boolean) {
    this.showSignup = val;
  }

  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }
}
