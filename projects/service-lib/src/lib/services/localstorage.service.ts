import { Injectable } from "@angular/core";
import { CompanySystemSettings, UserLogin } from "model-lib";

@Injectable({
  providedIn: "root"
})
export class CareConnectLocalStorage {
  currentData: any;
  currentUser: UserLogin;
  currFullName: string = "Anonymous User";

  constructor() {}

  getActiveTheme(): string {
    let x: any = localStorage.getItem("theme");
    return x;
  }

  getCompanySettings(): CompanySystemSettings {
    let ret: CompanySystemSettings;
    let tmpret: any = localStorage.getItem("ccprocmpSet");
    ret = JSON.parse(tmpret);
    return ret;
  }

  setLoginTheme(theme: string) {
    localStorage.setItem("theme", theme);
  }

  storeUserSession(val: string) {
    localStorage.setItem("ccpSession", val);
  }

  getUserSession() {
    const x: string = localStorage.getItem("ccpSession");
    return x;
  }

  setLoginToken(val: UserLogin) {
    localStorage.setItem("ccpToken", JSON.stringify(val).toString());
  }

  getLoginToken(): UserLogin {
    let x: any = localStorage.getItem("ccpToken");
    let ret: UserLogin;
    if (x != null && x != "" && x != undefined) {
      ret = JSON.parse(x);
    }
    return ret;
  }

  getThemeBackground(): string {
    let x: string = this.getActiveTheme();
    if (x != undefined && x != null) {
      const _theme: string[] = x.split("-");
      return _theme[0] + "-theme";
    }
    return "";
  }
}
