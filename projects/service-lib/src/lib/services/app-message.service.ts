import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Http, Response, Headers } from "@angular/http";
import { JsonPipe } from "@angular/common";
import { CareConnectLocalStorage } from "./localstorage.service";
import {
  APIUrls,
  AppMessageRequest,
  AppMessageDetail,
  AppMessageHeader,
  AppChatDetail,
  AppChatHeader,
  ChatRequest,
  SystemBroadcastDetail,
  SystemBroadcastHeader
} from "model-lib";
import { BaseMethod } from "../shared";

@Injectable({
  providedIn: "root"
})
export class AppMessageService extends BaseMethod {
  private activeMessageDetail: AppMessageDetail;
  public chatMessageSubscription: Subject<AppChatHeader> = new Subject<
    AppChatHeader
  >();

  constructor(
    private http: Http,
    private httpc: HttpClient,
    private localstore: CareConnectLocalStorage
  ) {
    super();
  }

  //consume chat web api
  getAllChatMessagesByEmployeeId(employeeId: string): any {
    return this.httpc
      .get(APIUrls.MessageAllChatMessagesByEmployeeId + "/" + employeeId)
      .pipe(
        map((ret: any) => {
          const chatList = <AppChatHeader[]>ret;
          return chatList;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  createChatSession(chatRequest: ChatRequest) {
    var params = JSON.stringify(chatRequest);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.MessageCreateChatSession, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          const retStatus = ret.json();
          return retStatus;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getActiveMessageDetail() {
    return this.activeMessageDetail;
  }

  setActiveMessageDetail(appMessage: AppMessageDetail) {
    this.activeMessageDetail = appMessage;
  }

  getChatDetailByChatId(chatId: string): any {
    return this.httpc.get(APIUrls.AppChat + "/" + chatId).pipe(
      map((ret: any) => {
        const chatList: AppChatDetail[] = ret;
        return chatList;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  postChatMessage(chatDetail: AppChatDetail) {
    var params = JSON.stringify(chatDetail);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(APIUrls.AppChat, params, { headers: headers }).pipe(
      map((ret: any) => {
        const retStatus = ret.json();
        return retStatus;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  //consume message web api

  getAllMessagesByEmployeeId(messageRequest: AppMessageRequest) {
    var params = JSON.stringify(messageRequest);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.MessageAllMessagesByEmployeeId, params, {
        headers: headers
      })
      .pipe(
        map((retVal: Response) => {
          var messageList = <AppMessageHeader[]>retVal.json();
          return messageList;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  getMessageDetailById(messageRequest: AppMessageRequest) {
    var params = JSON.stringify(messageRequest);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.MessageGetMessageDetail, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          var retStatus = <AppMessageDetail>ret.json();
          return retStatus;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  SendMessage(messageDetail: AppMessageDetail) {
    var params = JSON.stringify(messageDetail);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.AppMessage, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          var retStatus = ret.json();
          return retStatus;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  UpdateMessageReadStatus(messageRequest: AppMessageRequest) {
    var params = JSON.stringify(messageRequest);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.put(APIUrls.AppMessage, params, { headers: headers }).pipe(
      map((ret: any) => {
        var retStatus = ret.json();
        return retStatus;
      }),
      catchError(this.handleHttpResponseError$)
    );
  }

  DeleteMessage(messageRequest: AppMessageRequest) {
    var params = JSON.stringify(messageRequest);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.MessageDeleteMessage, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          var retStatus = ret.json();
          return retStatus;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }

  DeleteSelectedMessages(messageRequests: AppMessageRequest[]) {
    var params = JSON.stringify(messageRequests);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(APIUrls.MessageDeleteMessageList, params, { headers: headers })
      .pipe(
        map((ret: any) => {
          var retStatus = ret.json();
          return retStatus;
        }),
        catchError(this.handleHttpResponseError$)
      );
  }
}
