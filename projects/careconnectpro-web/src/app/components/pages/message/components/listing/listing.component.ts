import { Component, OnInit } from "@angular/core";
import {
  AppMessageRequest,
  AppMessageHeader,
  MessageFolderType,
  UserSession,
  Message,
  APIUrls
} from "model-lib";
import {
  AppMessageService,
  ProgressSpinnerService,
  AuthService,
  EmployeeService,
  MediaService,
  NotificationsService
} from "service-lib";
import { ActivatedRoute, Router } from "@angular/router";
import "rxjs/add/operator/finally";

import Draft = MessageFolderType.Draft;
import Inbox = MessageFolderType.Inbox;
import Sent = MessageFolderType.Sent;
import Trash = MessageFolderType.Trash;

@Component({
  selector: "app-listing-component",
  templateUrl: "./listing.component.html"
})
export class ListingComponent implements OnInit {
  typeMessage: string;
  mailboxType: string;
  messageRequest: AppMessageRequest;
  messageHeaders: AppMessageHeader[];
  userSession: UserSession;
  selectedMessages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private spinnerService: ProgressSpinnerService,
    private appMessageService: AppMessageService,
    private authService: AuthService,
    private router: Router,
    private employeeService: EmployeeService,
    private mediaSvc: MediaService,
    private notifyService: NotificationsService
  ) {}

  /**
   * Method - Life cycle hook - component initialization
   */
  ngOnInit() {
    //instantiate the app message request
    this.userSession = this.authService.getUserLoggedIn();
    this.messageRequest = {};
    this.messageRequest.recipientId = this.userSession.employeeId;
    this.parseUrlQuery();
    this.getEmployeeNames();
  }

  /**
   * Method - Retrieve mailbox type from URL query string
   */
  parseUrlQuery() {
    this.route.params.subscribe(parms => {
      this.mailboxType = parms["mailbox"];
      this.generateMessageRequest();
    });
  }

  /**
   * Method - Return a formatted datatime string
   * @param dateIn
   */
  formatDate(dateIn: Date) {
    let dateFormat = require("dateformat");
    return dateFormat(dateIn, "dddd, mmmm dS, yyyy, h:MM:ss TT");
  }

  /**
   * Method - Set the message request based on the mailbox type
   */
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

    this.getAllMessagesInMailbox();
  }

  /**
   * Method - Open view message view
   * @param messageId
   */
  viewMessage(messageId: string) {
    this.router.navigate(["home/message/view/" + this.mailboxType, messageId]);
  }

  /**
   * Method - Data service to retrieve all messages
   */
  getAllMessagesInMailbox() {
    this.spinnerService.show();
    let ret = this.appMessageService
      .getAllMessagesByEmployeeId(this.messageRequest)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          // let x: AppMessageHeader[] = data;
          this.messageHeaders = data;
        },
        (error: any) => {
          console.log(
            "OrgProfile Init - Error retrieving messages. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  /**
   * Method - Retrieve the media service image URL for the specified employee
   * @param employeeId
   */
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

  /**
   * Method - Find and return employee image name from the employee list
   * @param employeeId
   */
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

  /**
   * Method - Retrive list of employees from the employee service
   */
  getEmployeeNames() {
    let ret = this.employeeService
      .getAllEmployeeNames(this.userSession.companyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          const x: any = data;
        },
        (error: any) => {
          console.log(Message.ErrorEmployeeRetrieveEmployeeNames);
        }
      );
  }

  /**
   * selected mail
   * @param id
   */
  onChangeCheckbox(event, id) {
    if (event.target.checked) {
      if (this.selectedMessages.findIndex(item => item === id) < 0) {
        this.selectedMessages.push(id);
      }
    } else {
      if (this.selectedMessages.findIndex(item => item === id) > -1) {
        this.selectedMessages.splice(this.selectedMessages.indexOf(id), 1);
      }
    }
  }

  /**
   * delete selected mail
   */
  onDelete() {
    this.spinnerService.show();
    let appRequests: AppMessageRequest[] = [];

    this.selectedMessages.forEach(mesg => {
      let singleReq: AppMessageRequest;
      singleReq.id = mesg;
      singleReq.mailboxId = this.messageRequest.mailboxId;
      singleReq.recipientId = this.messageRequest.recipientId;
      appRequests.push(singleReq);
    });
    let ret = this.appMessageService
      .DeleteSelectedMessages(appRequests)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let x: any = data;
          this.getAllMessagesInMailbox();
        },
        (error: any) => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.ErrorEmployeeRetrieveEmployeeNames
          );
        }
      );
  }

  reloadPage() {
    this.getAllMessagesInMailbox();
  }
}
