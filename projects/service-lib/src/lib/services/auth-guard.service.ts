import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad,
  Route
} from "@angular/router";
import { AuthService } from "./auth.service";
import { CareConnectLocalStorage } from "./localstorage.service";
import { UserSession, GetBaseUrl } from "model-lib";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  public userSession: UserSession;
  public redirectUrl: string = "";

  constructor(
    private router: Router,
    private clocalstore: CareConnectLocalStorage,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let url: string = state.url;
    var ret = true;
    this.validateBaseUrl();
    const userSession: string = this.clocalstore.getUserSession();
    if (userSession === "" || userSession === "null") {
      this.redirectLoginPage(url);
    }
    const userLoggedIn$ = this.authService.GetSignedInUserInfo();
    const sessionExpired$ = this.authService.VerifyUserSessionExpired(
      userSession
    );

    return forkJoin(userLoggedIn$, sessionExpired$).pipe(
      map(
        ([val1, val2]) => {
          const response: UserSession = val1;
          if (response.employeeId === "") {
            this.redirectLogin();
          }
          if (val2 === true) {
            this.redirectLoginPage(url);
            ret = false;
          } else {
            ret = true;
            this.extendUserSession(userSession);
            return ret;
          }
        },
        error => {
          this.redirectLoginPage(url);
          ret = false;
          return ret;
        }
      )
    );
  }

  /**
   *  Method - Validate user session exist, if not redirect to login page
   */
  validateUserSession() {
    var ret = this.authService.GetSignedInUserInfo().subscribe(
      data => {
        const response: UserSession = data;
        if (response.employeeId === "") {
          this.redirectLogin();
        }
      },
      (error: any) => {
        this.redirectLogin();
      }
    );
  }

  /**
   * Method - Redirect to login if user session is not active
   */
  redirectLogin() {
    window.location.href = "/login";
  }

  /**
   * Method - Validate base url protocol and redirect to https
   */
  validateBaseUrl() {
    const baseUrl = GetBaseUrl();
    const urlArray = baseUrl.split("://");
    if (
      urlArray[0].toLowerCase() === "http" &&
      baseUrl.indexOf("localhost") < 0
    ) {
      const urlRedirect = "https://" + urlArray[1];
      window.location.href = urlRedirect;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    const userSession: string = this.clocalstore.getUserSession();
    return this.authService.VerifyUserSessionExpired(userSession).subscribe(
      data => {
        let response: boolean = data;
        if (!response) {
          this.extendUserSession(userSession);
          return true;
        } else {
          this.redirectLoginPage(url);
          return false;
        }
      },
      error => {
        this.redirectLoginPage(url);
        return false;
      }
    );
  }

  /**
   * Method - Redirect to login page after logout
   * @param url
   */
  redirectLoginPage(url: string) {
    // Store the attempted URL for redirecting
    this.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(["/login"]);
  }

  extendUserSession(userSession: string) {
    let ret = this.authService.ExtendSession(userSession).subscribe(
      data => {
        const response: any = data;
      },
      error => {}
    );
  }
}
