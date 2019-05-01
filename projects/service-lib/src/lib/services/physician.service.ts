import { Injectable } from "@angular/core";
import { APIUrls, Physician, PhysicianPracticeArea } from "model-lib";
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Headers } from "@angular/http";
import { HttpHeaders } from "@angular/common/http";
import { SelectItem } from "primeng/api";
import { BaseMethod } from "../shared";

@Injectable({
  providedIn: "root"
})
export class PhysicianService extends BaseMethod {
  public PhysicianPhotoName: string;
  public PhysicianPhotoPath: string = "../../../" + this.PhysicianPhotoName;
  public allphysicians: Physician[] = [];
  public physician: Physician = {};
  public isNewPhysician: boolean;
  public isNewPractice: boolean;
  public physicianPracticesSelect: SelectItem[] = [];

  private _physician: Physician = {};
  private _physicianPracticeArea: PhysicianPracticeArea = {};

  constructor(private http: Http, private httpc: HttpClient) {
    super();
  }

  initData() {
    this.physician = {};
  }

  revertPhysicianData() {
    let ret = this.getPhysicianById(this.physician.id).subscribe(
      (data: any) => {
        this.physician = {};
        this.physician = data;
      },
      this.logConsoleText
    );
  }

  getAllPhysicians(companyId: string): any {
    return this.httpc
      .get(APIUrls.PhysicianGetAllPhysicians + "/" + companyId)
      .pipe(
        map((ret: any) => {
          this._physician = ret;
          return this._physician;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getPhysicianById(physicianid: string): any {
    return this.httpc
      .get(APIUrls.PhysicianGetPhysicianById + "/" + physicianid)
      .pipe(
        map((ret: any) => {
          this._physician = ret;
          return this._physician;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getActivePhysicians(companyId: string): any {
    return this.httpc
      .get(APIUrls.PhysicianGetActivePhysicians + "/" + companyId)
      .pipe(
        map((ret: any) => {
          this._physician = ret;
          return this._physician;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getInActivePhysicians(companyId: string): any {
    return this.httpc
      .get(APIUrls.PhysicianGetInActivePhysicians + "/" + companyId)
      .pipe(
        map((ret: any) => {
          this._physician = ret;
          return this._physician;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getPhysicianArea(physicianId: string): any {
    return this.httpc
      .get(APIUrls.PhysicianGetPhysicianArea + "/" + physicianId)
      .pipe(
        map((ret: any) => {
          this._physicianPracticeArea = ret;
          return this._physicianPracticeArea;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  addPhysician(value: Physician) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(APIUrls.PhysicianAddPhysician, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          var acct = <Physician>ret.json();
          return acct;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  addPhysicianPracticeArea(value: PhysicianPracticeArea) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(APIUrls.PhysicianAddPhysicianArea, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          var acct = <PhysicianPracticeArea>ret.json();
          return acct;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  updatePhysician(value: Physician) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .put(APIUrls.PhysicianUpdatePhysician, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  updatePhysicianPracticeArea(value: PhysicianPracticeArea) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling update physician  service http");

    return this.http
      .put(APIUrls.PhysicianUpdatePhysicianArea, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  deletePhysician(value: Physician): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    console.log("calling delete vendor company http service");
    return this.httpc
      .delete(APIUrls.PhysicianDeletePhysician + "/" + value.id, {
        params: params,
        headers: headers
      })
      .pipe(
        map((ret: any) => {
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  deletePhysicianPracticeArea(value: PhysicianPracticeArea): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    console.log("calling delete physician practice area http service");
    return this.httpc
      .delete(APIUrls.PhysicianDeletePhysicianArea + "/" + value.id, {
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
