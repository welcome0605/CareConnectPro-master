import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Http, Headers } from "@angular/http";
import { APIUrls, GetApiURL, IdType } from "model-lib";
import { BaseMethod } from "../shared";

@Injectable({
  providedIn: "root"
})
export class DataService extends BaseMethod {
  /**
   * Method - Constructor
   */
  constructor(private http: Http, private httpc: HttpClient) {
    super();
  }

  /**
   * Method - Http client call to retrieve array of data from data service
   * @param obj
   * @param id
   * @param endPoint
   */
  getAllData<T>(obj: T, id: string, endPoint: string): any {
    return this.httpc.get(endPoint + "/" + id).pipe(
      map((ret: any) => {
        const val: T[] = ret;
        return val;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  /**
   * Method - Http client call to retrieve single data from data service
   * @param obj
   * @param id
   * @param endPoint
   */
  getSingleData<T>(obj: T, id: string, endPoint: string): any {
    return this.httpc.get(endPoint + "/" + id).pipe(
      map((ret: any) => {
        const val: T = ret;
        return val;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  /**
   * Method - Http post to call web api
   * @param obj
   * @param endPoint
   */
  postData<T>(obj: T, endPoint: string): any {
    var params = JSON.stringify(obj);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(endPoint, params, { headers: headers }).pipe(
      map((ret: any) => {
        const retStatus = ret.json();
        return retStatus;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  /**
   * Method - Http put to call web api
   * @param obj
   * @param endPoint
   */
  updateData<T>(obj: T, endPoint: string): any {
    var params = JSON.stringify(obj);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.put(endPoint, params, { headers: headers }).pipe(
      map((ret: any) => {
        const retStatus = ret.json();
        return retStatus;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  /**
   * Method - Http delete
   * @param id
   * @param endPoint
   */
  deleteData(id: string, endPoint: string): any {
    return this.http.delete(endPoint + "/" + id).pipe(
      map((ret: any) => {
        const retStatus = ret.json();
        return retStatus;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }
}
