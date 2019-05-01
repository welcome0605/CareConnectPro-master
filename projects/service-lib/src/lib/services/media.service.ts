import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  RequestOptions,
  Request,
  RequestMethod,
  Headers
} from "@angular/http";
import { Observable, Observer } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { APIUrls, MediaFile } from "model-lib";
import { BaseMethod } from "../shared";

@Injectable({
  providedIn: "root"
})
export class MediaService extends BaseMethod {
  public readonly defaultUserImage: string =
    "../../assets/images/defaultuserlogo.png";
  public readonly defaultCompanyImage: string =
    "../../assets/images/defaultcompanylogo.jpg";

  constructor(private _http: Http) {
    super();
  }

  getDefaultUserImage(): Observable<string> {
    return new Observable(Observer => {
      Observer.next(this.defaultUserImage);
      Observer.complete();
    });
  }

  getDefaultCompanyImage(): Observable<string> {
    return new Observable(Observer => {
      Observer.next(this.defaultCompanyImage);
      Observer.complete();
    });
  }

  mediaImagesCompanyGetAll(companyid: string): Observable<MediaFile> {
    var _Url = APIUrls.MediaImagesCompanyGetAll;
    return this._http.get(_Url + "/" + companyid).pipe(
      map((response: Response) => {
        console.log(response.json());
        var files = <MediaFile>response.json();
        return files;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesEmployeeGetAll(employeeid: string): Observable<MediaFile> {
    var _Url = APIUrls.MediaImagesEmployeeGetAll;
    return this._http.get(_Url + "/" + employeeid).pipe(
      map((response: Response) => {
        console.log(response.json());
        var files = <MediaFile>response.json();
        return files;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesCompanyDelete(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesCompanyDelete;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesEmployeeDelete(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesEmployeeDelete;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesCompanySave(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesCompanySave;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesEmployeeSave(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesEmployeeSave;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaAttachmentSave(
    companyId: string,
    fileIds: string[]
  ): Observable<string> {
    var _Url = APIUrls.MediaAttachmentSave + "/" + companyId;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(fileIds), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesPhysicianSave(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesPhysicianSave;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesPhysicianDelete(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesPhysicianDelete;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesPhysicianGetAll(physicianid: string): Observable<MediaFile> {
    var _Url = APIUrls.MediaImagesPhysicianGetAll;
    return this._http.get(_Url + "/" + physicianid).pipe(
      map((response: Response) => {
        console.log(response.json());
        var files = <MediaFile>response.json();
        return files;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesVendorSave(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesVendorSave;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesVendorDelete(file: MediaFile): Observable<string> {
    var _Url = APIUrls.MediaImagesVendorDelete;
    // This is a Post so we have to pass Headers
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    // Make the Angular 2 Post
    return this._http.post(_Url, JSON.stringify(file), options).pipe(
      map((response: Response) => <string>response.statusText),
      catchError(this.handleHttpResponseError$)
    );
  }

  mediaImagesVendorGetAll(vendorid: string): Observable<MediaFile> {
    var _Url = APIUrls.MediaImagesVendorGetAll;
    return this._http.get(_Url + "/" + vendorid).pipe(
      map((response: Response) => {
        console.log(response.json());
        var files = <MediaFile>response.json();
        return files;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }
}
