import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Response, Headers } from "@angular/http";
import { JsonPipe } from "@angular/common";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";
import { APIUrls, IscMaster, IcdCodeMaster } from "model-lib";

@Injectable({
  providedIn: "root"
})
export class IcdOasisService {
  private icdMasterCodes: IscMaster[] = [];

  constructor(
    private http: Http,
    private httpc: HttpClient,
    private localstore: CareConnectLocalStorage
  ) {}

  getOasisStatusTypes(): any {
    return this.httpc.get(APIUrls.IcdOasisGetAllOasisStatus).pipe(
      map((ret: any) => {
        this.icdMasterCodes = ret;
        return this.icdMasterCodes;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getIcdByDescription(keyword: string): any {
    return this.httpc.get(APIUrls.IcdOasisGetIcdByKeyword + "/" + keyword).pipe(
      map((ret: any) => {
        const icdList: IcdCodeMaster = ret;
        return icdList;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getIcdByCode(icdCode: string): any {
    return this.httpc.get(APIUrls.IcdOasisGetIcdByCode + "/" + icdCode).pipe(
      map((ret: any) => {
        const icdList: IcdCodeMaster = ret;
        return icdList;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }
}
