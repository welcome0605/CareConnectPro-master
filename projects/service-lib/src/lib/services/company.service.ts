import { Injectable, EventEmitter } from "@angular/core";
import {
  APIUrls,
  Company,
  Address,
  CompanySubscription,
  CompanySystemSettings,
  Department
} from "model-lib";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Response, Headers } from "@angular/http";
import { JsonPipe } from "@angular/common";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CompanyService {
  public companyLogo: string;
  public userprofilebg: string = "../../../" + this.companyLogo;
  public subsmodel: CompanySubscription = {};
  public companySubscriptions: CompanySubscription[];
  public activeSubscription: CompanySubscription = {};

  private _companyInfo: Company = {};
  private _companyAddress: Address = {};
  private _companySubscriptions: CompanySubscription = {};
  private _companySettings: CompanySystemSettings = {};
  private _companyDepartment: Department = {};

  isCompanyRecordChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: Http,
    private httpc: HttpClient,
    private localstore: CareConnectLocalStorage
  ) {
    //this.subsmodel = new CompanySubscription();
    //this.activeSubscription = new CompanySubscription();
  }

  getCompanyInfo() {
    return this._companyInfo;
  }

  setCompanyInfo(val: Company) {
    this._companyInfo = val;
  }

  getCompanyById(cmpId: string): any {
    console.log("calling http data get company service, id: " + cmpId);
    return this.httpc.get(APIUrls.CompanyApi + "/" + cmpId).pipe(
      map((ret: any) => {
        console.log("Service - GetCompanyId returned OK");
        this.setCompanyInfo(ret);
        return this._companyInfo;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getCompanyAddressById(cmpId: string): any {
    return this.httpc.get(APIUrls.CompanyAddressApi + "/" + cmpId).pipe(
      map((ret: any) => {
        console.log("Service - GetCompAddress returned OK");
        var x: any = ret;
        this._companyAddress = x;
        return this._companyAddress;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getCompanyDepartmentById(cmpId: string): any {
    return this.httpc.get(APIUrls.CompanyDepartmentsApi + "/" + cmpId).pipe(
      map((ret: any) => {
        console.log("Service - GetCompany Department returned OK");
        var x: any = ret;
        this._companyDepartment = x;
        return this._companyDepartment;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getCompanySubscriptionById(cmpId: string): any {
    return this.httpc.get(APIUrls.CompanySubscriptionsApi + "/" + cmpId).pipe(
      map((ret: any) => {
        console.log("Service - GetCompany subscription returned OK");
        var x: any = ret;
        this._companySubscriptions = x;
        return this._companySubscriptions;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getCompanySettingsById(cmpId: string): any {
    return this.httpc.get(APIUrls.CompanySettingsApi + "/" + cmpId).pipe(
      map((ret: any) => {
        console.log("Service - GetCompany settings returned OK");
        var x: any = ret;
        this._companySettings = x;
        return this._companySettings;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getCompanyLogo() {
    return this.companyLogo;
  }

  saveCompanyLogo(logo: string) {
    this.companyLogo = logo;
  }

  getCompanyAddresses() {
    return this._companyAddress;
  }

  getCompanySubscription() {
    return this._companySubscriptions;
  }

  getDepartments() {
    return this._companyDepartment;
  }

  getActiveCompanySettings() {
    return this._companySettings;
  }

  setActiveCompanySettings(value: CompanySystemSettings) {
    this._companySettings = value;
  }

  addSubscription(value: CompanySubscription) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling add subscription http");

    return this.http
      .post(APIUrls.CompanySubscriptionsApi, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned register OK");
          var acct = <CompanySubscription>ret.json();
          return acct;
        }),
        catchError((e: any) => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  updateSystemSettings(value: CompanySystemSettings) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling update company settings http");

    return this.http
      .put(APIUrls.CompanySettingsApi + "/" + value.id, params, {
        headers: headers
      })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError((e: any) => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  updateAddress(value: Address) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling add address http");

    return this.http
      .put(APIUrls.CompanyAddressApi, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError((e: any) => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  addAddress(value: Address) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling add address http");

    return this.http
      .post(APIUrls.CompanyAddressApi, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned register OK");
          var acct = <Address>ret.json();
          return acct;
        }),
        catchError((e: any) => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  addDepartment(value: Department) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling add department http");

    return this.http
      .post(APIUrls.CompanyDepartmentsApi, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned register OK");
          var dat = <Department>ret.json();
          return dat;
        }),
        catchError((e: any) => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  updateDepartment(value: Department) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    console.log("calling update department http service");
    return this.http
      .put(APIUrls.CompanyDepartmentsApi + "/" + value.id, params, {
        headers: headers
      })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError((e: any) => {
          console.log("Service returned update ERROR");
          return Observable.throw(e);
        })
      );
  }

  addSystemSettings(value: CompanySystemSettings) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling add company system settings http");

    return this.http
      .post(APIUrls.CompanySettingsApi, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned register OK");
          var dat = <CompanySystemSettings>ret.json();
          return dat;
        }),
        catchError((e: any) => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  updateCompanyInfo(value: Company): any {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    console.log("calling update company http service");
    return this.http
      .put(APIUrls.CompanyApi + "/" + value.id, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          //var acct = <ILoginResult>ret.json();
          return ret;
        }),
        catchError((e: any) => {
          console.log("Service returned update ERROR");
          return Observable.throw(e);
        })
      );
  }

  deleteAddress(value: Address): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    console.log("calling delete address company http service");
    return this.httpc
      .delete(APIUrls.CompanyAddressApi + "/" + value.id, {
        params: params,
        headers: headers
      })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError((e: any) => {
          console.log("Service returned update ERROR");
          return Observable.throw(e);
        })
      );
  }

  deleteDepartment(value: Department): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    console.log("calling delete department http service");
    return this.httpc
      .delete(APIUrls.CompanyDepartmentsApi + "/" + value.id, {
        params: params,
        headers: headers
      })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError((e: any) => {
          console.log("Service returned update ERROR");
          return Observable.throw(e);
        })
      );
  }
}
