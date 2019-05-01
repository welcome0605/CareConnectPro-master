import { Injectable } from "@angular/core";
import { APIUrls, Vendor, VendorBusinessService } from "model-lib";
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Headers } from "@angular/http";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";
import { SelectItem } from "primeng/api";
import { BaseMethod } from "../shared";

@Injectable({
  providedIn: "root"
})
export class VendorService extends BaseMethod {
  public VendorPhotoName: string;
  public VendorPhotoPath: string = "../../../" + this.VendorPhotoName;
  public allvendors: Vendor[] = [];
  public vendor: Vendor = {};
  public isNewVendor: boolean = false;
  public isNewService: boolean = false;
  public vendorBusinessServicesSelect: SelectItem[] = [];
  private _vendor: Vendor = {};
  private _vendorBusinessService: VendorBusinessService = {};

  constructor(private http: Http, private httpc: HttpClient) {
    super();
  }

  initData() {
    this.vendor = {};
  }

  revertVendorData() {
    let ret = this.getVendorById(this.vendor.id).subscribe(
      (data: any) => {
        this.vendor = {};
        this.vendor = data;
      },
      (error: any) => {
        console.log(
          "Revert Physician Data - Please contact Care Connect Pro service desk."
        );
      }
    );
  }

  getVendorById(vendorid: string): any {
    return this.httpc.get(APIUrls.VendorGetVendorById + "/" + vendorid).pipe(
      map((ret: any) => {
        this._vendor = ret;
        return this._vendor;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  getAllVendors(companyId: string): any {
    return this.httpc.get(APIUrls.VendorGetAllVendors + "/" + companyId).pipe(
      map((ret: any) => {
        this._vendor = ret;
        return this._vendor;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  getActiveVendors(companyId: string): any {
    return this.httpc
      .get(APIUrls.VendorGetAllActiveVendors + "/" + companyId)
      .pipe(
        map((ret: any) => {
          this._vendor = ret;
          return this._vendor;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getInActiveVendors(companyId: string): any {
    return this.httpc
      .get(APIUrls.VendorGetAllInActiveVendors + "/" + companyId)
      .pipe(
        map((ret: any) => {
          this._vendor = ret;
          return this._vendor;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getVendorBusinessService(vendorId: string): any {
    return this.httpc
      .get(APIUrls.VendorGetVendorServices + "/" + vendorId)
      .pipe(
        map((ret: any) => {
          console.log("Service - GetEmployeeId returned OK");
          this._vendorBusinessService = ret;
          return this._vendorBusinessService;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  addVendor(value: Vendor) {
    let params = JSON.stringify(value);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(APIUrls.VendorAddVendor, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned  OK");
          var acct = <Vendor>ret.json();
          return acct;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  addVendorBusinessService(value: VendorBusinessService) {
    let params = JSON.stringify(value);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(APIUrls.VendorAddVendorServices, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned  OK");
          var acct = <VendorBusinessService>ret.json();
          return acct;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  updateVendor(value: Vendor) {
    let params = JSON.stringify(value);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .put(APIUrls.VendorUpdateVendor, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  updateVendorBusinessService(value: VendorBusinessService) {
    let params = JSON.stringify(value);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .put(APIUrls.VendorUpdateVendorServices, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned OK");
          return ret;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  deleteVendor(value: Vendor): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this.httpc
      .delete(APIUrls.VendorDeleteVendor + "/" + value.id, {
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

  deleteVendorBusinessService(value: VendorBusinessService): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this.httpc
      .delete(APIUrls.VendorDeleteVendorServices + "/" + value.id, {
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
