import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  RequestOptions,
  Request,
  RequestMethod,
  Headers
} from "@angular/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { APIUrls, ResetPasswordMessage, MessageStatus } from "model-lib";

@Injectable({
  providedIn: "root"
})
export class EmailService {
  constructor(private _http: Http) {}

  sendMessage(msg: ResetPasswordMessage): any {
    msg.authCode = APIUrls.EmailAuthCode;
    var params = JSON.stringify(msg);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this._http
      .post(APIUrls.SendEmailApi, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          console.log("Service returned register OK");
          var apiStatus = <MessageStatus>ret.json();
          return apiStatus;
        }),
        catchError((e: any) => {
          console.log(e);
          return Observable.throw(e);
        })
      );
  }
}
