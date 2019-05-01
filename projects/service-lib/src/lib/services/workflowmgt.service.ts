import { Injectable, EventEmitter } from "@angular/core";
import {
  APIUrls,
  AppUserType,
  IdentityAppUser,
  AppAsset,
  AppRole,
  AppRolePermission
} from "model-lib";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Response, Headers } from "@angular/http";
import { JsonPipe } from "@angular/common";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class WorkflowMgtService {
  private _identityAppUser: IdentityAppUser;

  constructor(
    private http: Http,
    private httpc: HttpClient,
    private localstore: CareConnectLocalStorage
  ) {}
}
