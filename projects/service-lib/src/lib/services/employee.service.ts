import { Injectable } from "@angular/core";
import {
  APIUrls,
  Employee,
  EmployeeSummary,
  EmployeeName,
  Department,
  AppRole,
  AppUserType,
  GenderCode,
  SuffixCode,
  PrefixCode
} from "model-lib";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Headers } from "@angular/http";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class EmployeeService {
  public employeePhotoName: string;
  public password2: string;
  public employeePhotoPath: string = "../../../" + this.employeePhotoName;
  public departments: Department[] = [];
  public appRoles: AppRole[] = [];
  public allEmployees: EmployeeSummary[] = [];
  public appUserTypes: AppUserType[] = [];
  public genderCodes: GenderCode[];
  public suffixCodes: SuffixCode[];
  public prefixCodes: PrefixCode[];
  public dateTerminated: any;
  public dateHired: any;
  public dateOfBirth: any;
  public employeeNames: EmployeeName[];
  private _employeesSummary: EmployeeSummary[] = [];
  private _employeeSummary: EmployeeSummary = {};
  public isNewEmployee: boolean = false;
  public employee: EmployeeSummary = {};

  constructor(
    private http: Http,
    private httpc: HttpClient,
    private localstore: CareConnectLocalStorage
  ) {}

  initData() {
    this.employee = {};
    this.dateHired = "";
    this.dateOfBirth = "";
    this.dateTerminated = "";
  }

  /**
   * Method - return cached employee names from service
   */
  getEmployeeNames(): EmployeeName[] {
    return this.employeeNames;
  }

  revertEmployeeData() {
    let ret = this.getEmployeeSummaryById(this.employee.employeeId).subscribe(
      (data: any) => {
        this.employee = {};
        this.employee = data;
      },
      (error: any) => {
        console.log(
          "Revert Employee Data - Please contact Care Connect Pro service desk."
        );
      }
    );
  }

  getAllEmployeesSummary(companyId: string): any {
    console.log(
      "calling http data get all employee summary service, id: " + companyId
    );
    return this.httpc
      .get(APIUrls.EmployeeGetAllEmployeesSummary + "/" + companyId)
      .pipe(
        map((ret: any) => {
          console.log("Service - GetEmployeeId returned OK");
          this._employeesSummary = ret;
          return this._employeesSummary;
        }),
        catchError((e: any) => {
          console.log("Service returned ERROR");
          return Observable.throw(e);
        })
      );
  }

  getEmployeeSummaryById(employeeId: string): any {
    return this.httpc
      .get(APIUrls.EmployeeGetEmployeesSummaryById + "/" + employeeId)
      .pipe(
        map((ret: any) => {
          //console.log('Service - GetEmployeeId returned OK');
          this._employeeSummary = ret;
          return this._employeeSummary;
        }),
        catchError((e: any) => {
          console.log("Service returned ERROR");
          return Observable.throw(e);
        })
      );
  }

  getEmployeeSummaryByAppUserId(appUserId: string): any {
    return this.httpc
      .get(APIUrls.EmployeeGetEmployeeByAppUserId + "/" + appUserId)
      .pipe(
        map((ret: any) => {
          //console.log('Service - GetEmployeeId returned OK');
          this._employeeSummary = ret;
          return this._employeeSummary;
        }),
        catchError((e: any) => {
          console.log("Service returned ERROR");
          return Observable.throw(e);
        })
      );
  }

  getActiveEmployeesSummary(companyId: string): any {
    console.log(
      "calling http data get all employee summary service, id: " + companyId
    );
    return this.httpc
      .get(APIUrls.EmployeeGetActiveEmployeesSummary + "/" + companyId)
      .pipe(
        map((ret: any) => {
          console.log("Service - GetEmployeeId returned OK");
          this._employeesSummary = ret;
          return this._employeesSummary;
        }),
        catchError((e: any) => {
          console.log("Service returned ERROR");
          return Observable.throw(e);
        })
      );
  }

  /**
   * Method - Get all employee names for company and store in service property employeeNames
   * @param companyId
   */
  getAllEmployeeNames(companyId: string): any {
    return this.httpc
      .get(APIUrls.EmployeeGetAllEmployeeNamesByCompanyId + "/" + companyId)
      .pipe(
        map((ret: any) => {
          this.employeeNames = ret;
          return this.employeeNames;
        }),
        catchError((e: any) => {
          console.log("Service returned ERROR");
          return Observable.throw(e);
        })
      );
  }

  getInActiveEmployeesSummary(companyId: string): any {
    console.log(
      "calling http data get all employee summary service, id: " + companyId
    );
    return this.httpc
      .get(APIUrls.EmployeeGetInActiveEmployeesSummary + "/" + companyId)
      .pipe(
        map((ret: any) => {
          console.log("Service - GetEmployeeId returned OK");
          this._employeesSummary = ret;
          return this._employeesSummary;
        }),
        catchError((e: any) => {
          console.log("Service returned ERROR");
          return Observable.throw(e);
        })
      );
  }

  addEmployeeSummary(value: EmployeeSummary) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling add employee http");

    return this.http
      .post(APIUrls.EmployeeAddEmployeesSummary, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned register OK");
          var acct = <EmployeeSummary>ret.json();
          return acct;
        }),
        catchError((e: any) => {
          console.log("Service returned register ERROR");
          return Observable.throw(e);
        })
      );
  }

  updateEmployee(value: EmployeeSummary) {
    var params = JSON.stringify(value);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    console.log("calling update employee http");

    return this.http
      .put(APIUrls.EmployeeUpdateEmployee, params, { headers: headers })
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

  deleteEmployee(value: Employee): any {
    let params = new HttpParams();
    params = params.append("id", <string>value.id);

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    console.log("calling delete employee company http service");
    return this.httpc
      .delete(APIUrls.EmployeeDeleteEmployee + "/" + value.id, {
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

  getDepartmentNameById(id: string) {
    let ret: string = "";
    if (this.departments) {
      let x: any = this.departments.find(x => x.id === id);
      if (x != null && x != undefined && x != "") {
        ret = x.name;
      }
    }
    return ret;
  }

  getRoleNameById(id: string) {
    let ret: string = "";
    if (this.appRoles) {
      let x: any = this.appRoles.find(x => x.id === id);
      if (x != null && x != undefined && x != "") {
        ret = x.name;
      }
    }
    return ret;
  }

  getEmployeeNameById(id: string) {
    let ret: string = "";
    if (this.appRoles) {
      let x: any = this.allEmployees.find(x => x.employeeId === id);
      if (x != null && x != undefined && x != "") {
        ret = x.firstName + " " + x.lastName;
      }
    }
    return ret;
  }
}
