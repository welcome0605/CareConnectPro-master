import { Injectable, EventEmitter } from "@angular/core";
import {
  APIUrls,
  AppUserType,
  IdentityAppUser,
  AppAsset,
  AppRole,
  AppRolePermission
} from "model-lib";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Response, Headers } from "@angular/http";
import { JsonPipe } from "@angular/common";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";
import { BaseMethod } from "../shared";

@Injectable({
  providedIn: "root"
})
export class SecurityService extends BaseMethod {
  private _appAssets: AppAsset[] = [];
  private _appAsset: AppAsset;
  private _appPermissions: AppRolePermission[] = [];
  private _appPermission: AppRolePermission;
  private _appRoles: AppRole[] = [];
  private _appRole: AppRole;
  private _appUserTypes: AppUserType[] = [];
  private _appUserType: AppUserType;
  isAppRoleUpdated: EventEmitter<boolean> = new EventEmitter();
  private _identityAppUser: IdentityAppUser;

  constructor(
    private http: Http,
    private httpc: HttpClient,
    private localstore: CareConnectLocalStorage
  ) {
    super();
  }

  getAllAssets(): any {
    return this.httpc.get(APIUrls.SecurityGetAllAssets).pipe(
      map((ret: any) => {
        //console.log('Service - GetCompanyId returned OK');
        this._appAssets = ret;
        return this._appAssets;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  getPermissionsByRole(roleId: string): any {
    return this.httpc
      .get(APIUrls.SecurityGetAllPermissions + "/" + roleId)
      .pipe(
        map((ret: any) => {
          //console.log('Service - GetCompanyId returned OK');
          this._appPermissions = ret;
          return this._appPermissions;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getAllRoles(companyId: string): any {
    return this.httpc.get(APIUrls.SecurityGetAllRoles + "/" + companyId).pipe(
      map((ret: any) => {
        //console.log('Service - GetCompanyId returned OK');
        this._appRoles = ret;
        return this._appRoles;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  getNewGuid(): any {
    return this.httpc.get(APIUrls.AccountNewGuid).pipe(
      map((ret: any) => {
        return ret;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  getUserTypeByCode(appUserTypeCode: number): any {
    console.log("calling http data get user type by code: ");
    return this.httpc
      .get(APIUrls.AccountGetUserTypeByCode + "/" + appUserTypeCode)
      .pipe(
        map((ret: any) => {
          console.log("Service - Get User Type returned OK");
          this._appUserType = ret;
          return this._appUserType;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  validateUserNameExist(username: string): any {
    console.log("calling http validate user name exist: ");
    return this.httpc
      .get(APIUrls.AccountValidateUsername + "/" + username)
      .pipe(
        map((data: any) => {
          console.log("Service - Validate Username OK");
          let ret: any = data;
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getUserTypes(): any {
    console.log("calling http data get user types, id: ");
    return this.httpc.get(APIUrls.AccountGetUserTypes).pipe(
      map((ret: any) => {
        console.log("Service - Get User Types returned OK");
        this._appUserTypes = ret;
        return this._appUserTypes;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  addRole(value: AppRole) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    //console.log('calling add subscription http');
    return this.http
      .post(APIUrls.SecurityAddRole, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned register OK");
          var acct = <AppRole>ret.json();
          return acct;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  addRolePermission(value: AppRolePermission) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    //console.log('calling add subscription http');
    return this.http
      .post(APIUrls.SecurityAddRolePermission, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          //console.log('Service returned register OK');
          var acct = <AppRolePermission>ret.json();
          return acct;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  updateAppRole(value: AppRole) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.SecurityUpdateRole, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  updateAppRolePermission(value: AppRolePermission) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(APIUrls.SecurityUpdatePermission, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  deleteRole(value: AppRole): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);
    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.httpc
      .delete(APIUrls.SecurityDeleteRole + "/" + value.id, {
        params: params,
        headers: headers
      })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  deleteRolePermission(value: AppRolePermission): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);
    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this.httpc
      .delete(APIUrls.SecurityDeletePermission + "/" + value.id, {
        params: params,
        headers: headers
      })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }
}
