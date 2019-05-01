import { Component, OnInit } from "@angular/core";
import {
  Message,
  UserSession,
  Mail,
  AppMessageDetail,
  AppMessageRequest,
  MessageFolderType,
  EmployeeName,
  APIUrls
} from "model-lib";
import {
  AuthService,
  NotificationsService,
  AppMessageService,
  ProgressSpinnerService,
  EmployeeService,
  MediaService
} from "service-lib";
import { Router, ActivatedRoute } from "@angular/router";

import Draft = MessageFolderType.Draft;
import Inbox = MessageFolderType.Inbox;
import Sent = MessageFolderType.Sent;
import Trash = MessageFolderType.Trash;

@Component({
  selector: "app-detail-component",
  templateUrl: "./detail.component.html"
})
export class DetailComponent implements OnInit {
  userSession: UserSession;
  messageDetail: AppMessageDetail = {};
  messageId: string;
  mailboxType: string;
  messageRequest: AppMessageRequest = {};
  employeeNames: EmployeeName[];

  constructor(
    private spinnerService: ProgressSpinnerService,
    private appMessageService: AppMessageService,
    private authService: AuthService,
    private notifyService: NotificationsService,
    private router: Router,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private mediaSvc: MediaService
  ) {}

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.messageRequest = {};
    this.messageRequest.recipientId = this.userSession.employeeId;
    this.initData();
    this.parseUrlQuery();
    this.getMessage();
  }

  initData() {
    this.messageDetail.fileAttachments = [];
    this.messageDetail.recipients = [];
  }

  generateMessageRequest() {
    switch (this.mailboxType) {
      case "inbox":
        this.messageRequest.mailboxId = Inbox;
        break;
      case "draft":
        this.messageRequest.mailboxId = Draft;
        break;
      case "sent":
        this.messageRequest.mailboxId = Sent;
        break;
      case "trash":
        this.messageRequest.mailboxId = Trash;
        break;
    }
  }

  parseUrlQuery() {
    this.route.params.subscribe(parms => {
      this.mailboxType = parms["mailbox"];
      this.messageRequest.id = parms["id"];
      this.generateMessageRequest();
    });
  }

  getMessage() {
    this.spinnerService.show();
    let ret = this.appMessageService
      .getMessageDetailById(this.messageRequest)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          this.messageDetail = data;
          if (this.messageDetail.fileAttachments === null) {
            this.messageDetail.fileAttachments = [];
          }
          if (this.messageDetail.recipients === null) {
            this.messageDetail.recipients = [];
          }
        },
        error => {
          console.log(Message.ErrorGetMessageDetailFailure);
        }
      );
  }

  replyToMessage() {
    this.appMessageService.setActiveMessageDetail(this.messageDetail);
    this.router.navigate(["/home/message/reply/", this.messageDetail.id]);
  }

  forwardMessage() {
    this.appMessageService.setActiveMessageDetail(this.messageDetail);
    this.router.navigate(["/home/message/forward/", this.messageDetail.id]);
  }

  getEmployeeImage(employeeId) {
    const photoName: string = this.getEmployeePhoto(employeeId);
    let imgSrc: string = "";
    if (photoName != "") {
      imgSrc = APIUrls.GetImageEmployee + "/" + photoName;
    } else {
      imgSrc = this.mediaSvc.defaultUserImage;
    }
    return imgSrc;
  }

  getAttachmentLabel(count: number) {
    return `(${count})`;
  }

  isAttachmentImage(fileId: string): boolean {
    const extArray = fileId.trim().split(".");
    let res: boolean = false;

    if (extArray.length > 1) {
      switch (extArray[1].toLowerCase()) {
        case "jpg":
        case "jpeg":
        case "gif":
        case "tiff":
        case "png":
          res = true;
          break;
        default:
          res = false;
          break;
      }
    }
    return res;
  }

  getAttachmentClass(fileId: string) {
    const extArray = fileId.trim().split(".");
    let attClass: string = "fa fa-file";

    if (extArray.length > 1) {
      switch (extArray[1].toLowerCase()) {
        case "pdf":
          attClass = "fa fa-file-pdf-o";
          break;
        case "docx":
        case "doc":
          attClass = "fa fa-file-word-o";
          break;
        case "xls":
        case "xlsx":
          attClass = "fa fa-file-excel-o";
          break;
        case "ppt":
        case "pptx":
          attClass = "fa fa-file-powerpoint-o";
          break;
        default:
          attClass = "fa fa-file-o";
          break;
      }
    }
    return attClass;
  }

  getAttachmentUrl(fileId: string, fileName: string) {
    let fileUrl =
      APIUrls.GetAttachment +
      "/" +
      this.userSession.companyId +
      "/" +
      fileId.trim() +
      "/" +
      encodeURI(fileName.trim());
    return fileUrl;
  }

  findEmployeeName(employeeId: string) {
    let ret: string = "N/A";
    const x = this.employeeService.employeeNames.findIndex(
      y => y.id === employeeId
    );
    if (x > -1) {
      ret = this.employeeService.employeeNames[x].name;
    }
    return ret;
  }

  getEmployeePhoto(employeeId: string) {
    let ret: string = "";
    const x = this.employeeService.employeeNames.findIndex(
      y => y.id === employeeId
    );
    if (x > -1) {
      ret = this.employeeService.employeeNames[x].photoName;
    }
    return ret;
  }
}
