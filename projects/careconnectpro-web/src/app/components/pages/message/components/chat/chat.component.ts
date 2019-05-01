import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  CareConnectLocalStorage,
  AuthService,
  EmployeeService,
  AppMessageService,
  ProgressSpinnerService,
  NotificationsService,
  SignalrhubService
} from "service-lib";
import {
  APIUrls,
  UserLogin,
  UserSession,
  EmployeeName,
  ChatDiscussion,
  AppChatDetail,
  Message,
  AppChatHeader,
  ChatRequest,
  ChatContact,
  ChatSession
} from "model-lib";
import { SelectItem } from "primeng/primeng";
import { BaseComponent } from "../../../../shared/core";
import { takeUntil, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-chat-component",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent extends BaseComponent implements OnInit {
  contacts: Array<ChatContact>;
  discussions: Array<ChatDiscussion>;
  searchText: string;
  message: string;
  currentContact: ChatContact = {};
  imgSrc: string;
  loginToken: UserLogin = {};
  userSession: UserSession = {};
  parmId: number;
  employeeNames: EmployeeName[];
  activeChatSessions: ChatSession[] = [];
  imguser1: any;
  usersList: SelectItem[];
  selectedUsers: SelectItem[];
  activeChatId: string;
  chatHeaders: AppChatHeader[] = [];

  /**
   * Method - Constructor
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private localstore: CareConnectLocalStorage,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private spinnerService: ProgressSpinnerService,
    private notifyService: NotificationsService,
    private appMessageSvc: AppMessageService,
    private chatService: SignalrhubService
  ) {
    super();
    this.contacts = Array<ChatContact>();
    this.discussions = Array<ChatDiscussion>();
    this.loginToken = this.localstore.getLoginToken();
  }

  /**
   * Method - Life cylce hook - init
   */
  ngOnInit() {
    this.imguser1 = require("../../../../../../assets/images/defaultuserlogo.png");
    this.imgSrc = require("../../../../../../assets/images/defaultcompanylogo.jpg");
    this.userSession = this.authService.getUserLoggedIn();
    if (!!this.userSession) {
      this.initComponentData();
    }
    this.getLoggedInUserInfo();
  }

  /**
   * Method - Retrieve user session object
   */
  getLoggedInUserInfo() {
    this.authService.userSessionSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.userSession = data;
        this.initComponentData();
      });
  }

  /**
   * Method - Initialize component data
   */
  initComponentData() {
    this.getEmployeeNames();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (
        params["id"] === undefined &&
        this.contacts.find(x => (x.id === params["id"]) === undefined)
      ) {
        this.parmId = 1;
      } else {
        this.parmId = Number(params["id"]);
      }

      this.currentContact = this.contacts.find(x => x.id === params["id"]);
    });
    //monitor chat
    this.monitorChatHub();
  }

  /**
   * Method - Connect to chat hub and monitor incoming chat messages
   */
  monitorChatHub() {
    this.appMessageSvc.chatMessageSubscription
      .pipe(takeUntil(this.destroy$))
      .subscribe(chatMsg => {
        if (this.activeChatId === chatMsg.chatId) {
          this.getChatDiscussions(this.activeChatId);
        }
      });
  }

  /**
   * Method - Get list of employee names and add to UI drop down list
   */
  populateUsersList() {
    const tmpEmployeeNames = this.employeeNames.filter(
      emp => emp.id !== this.userSession.employeeId
    );
    let y: any = tmpEmployeeNames.sort(function(a: any, b: any) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    let z: any = y.map(function(user: any) {
      return {
        label: user.name,
        value: user.id
      };
    });
    this.usersList = z;
  }

  /**
   * Method - Get CSS stule for the background of active chat link
   * @param chatId
   */
  getActiveChatBgColor(chatId: string) {
    const styleClass = chatId === this.activeChatId ? "active-chat" : "";
    return styleClass;
  }

  parseDate(entryDate: Date, dateFormat: number): string {
    let retDate = "";
    if (!!entryDate) {
      switch (dateFormat) {
        case 1:
          const dateArry = entryDate.toString().split("T");
          const datePart = dateArry[0];
          const timePart = dateArry[1].split(".")[0].split(":");
          retDate = `${datePart} ${timePart[0]}:${timePart[1]}`;
          break;
        case 2:
          const dateYear = entryDate.getFullYear();
          const dateMonth = entryDate.getMonth() + 1;
          const dateDay = entryDate.getDate();
          const dateTime = entryDate.getHours();
          const dateMin = entryDate.getMinutes();
          retDate = `${dateYear}-${dateMonth}-${dateDay} ${dateTime}:${dateMin}`;
          break;
      }
    }
    return retDate;
  }

  onSendMessage() {
    if (!!this.message) {
      const currDate = new Date();
      const chatDetail: AppChatDetail = {
        id: null,
        chatId: this.activeChatId,
        userId: this.userSession.employeeId,
        message: this.message,
        attachmentId: null,
        attachmentName: null,
        dateCreated: currDate
      };
      this.appMessageSvc.postChatMessage(chatDetail).subscribe(
        data => {
          if (data) {
            this.discussions.push({
              id: data,
              message: this.message,
              date: this.parseDate(currDate, 2),
              contactInfo: {
                id: this.userSession.employeeId,
                image: this.userSession.employeePhotoName,
                fullName: this.userSession.fullName,
                status: "online"
              },
              senderInfo: true
            });
            this.message = null;
            this.notifyChatHub();
          }
        },
        error => {
          this.notifyService.notify(
            error,
            "Chat service error",
            Message.PostChatDetailFailed
          );
          console.log(Message.PostChatDetailFailed);
        }
      );
    }
  }

  notifyChatHub() {
    const chatHeader = this.chatHeaders.find(
      header => header.chatId === this.activeChatId
    );
    if (!!chatHeader) {
      this.chatService.sendChat(chatHeader);
    }
  }

  getEmployeeNames() {
    this.spinnerService.show();
    let ret = this.employeeService
      .getAllEmployeeNames(this.userSession.companyId)
      .finally(() => {
        this.spinnerService.hide();
        this.getChatSessions();
        this.populateUsersList();
      })
      .subscribe(
        data => {
          const ret: EmployeeName[] = data;
          if (ret != undefined) {
            this.employeeNames = ret;
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.ErrorEmployeeRetrieveEmployeeNames
          );
        }
      );
  }

  setDefaultChat() {
    this.activeChatId = this.activeChatSessions[0].chatId;
    this.getChatDiscussions(this.activeChatId);
  }

  getContactImg(imgName: any): any {
    let imgUrl: any;

    if (imgName != undefined && imgName != "") {
      imgUrl = APIUrls.GetImageEmployee + "/" + imgName;
    } else {
      imgUrl = this.imguser1;
    }
    return imgUrl;
  }

  mapEmployeeToContacts() {
    this.contacts = this.employeeNames.map(
      value =>
        <ChatContact>{
          id: value.id,
          fullName: value.name,
          image: value.photoName,
          status: "online"
        }
    );
  }

  createChatSession() {
    if (this.selectedUsers.length > 0) {
      let chatRequest: ChatRequest = { employeeId: "", recipients: [] };

      chatRequest.employeeId = this.userSession.employeeId;
      chatRequest.recipients.push(this.userSession.employeeId);

      this.selectedUsers.forEach((user: any) => {
        if (user !== this.userSession.employeeId) {
          chatRequest.recipients.push(user);
        }
      });
      this.spinnerService.show();
      this.appMessageSvc
        .createChatSession(chatRequest)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            if (!!data) {
              this.startChat(data);
              this.selectedUsers = [];
            }
          },
          error => {
            this.notifyService.notify(
              "error",
              "Message Error",
              Message.GetAllChatHeadersFailed
            );
          }
        );
    }
  }

  startChat(chatId: string) {
    let chatSession: ChatSession = { chatId: chatId, chatUsers: [] };
    chatSession.chatId = chatId;
    this.selectedUsers.forEach((userId: any) => {
      const _user = this.employeeNames.filter(item => item.id === userId);
      if (_user.length > 0) {
        const tmpContact = _user.map(
          data =>
            <ChatContact>{
              id: data.id,
              fullName: data.name,
              image: data.photoName,
              status: "online"
            }
        );
        chatSession.chatUsers.push(tmpContact[0]);
      }
    });
    this.activeChatSessions.push(chatSession);
  }

  mapChatHeaderToContacts(chatHeaders: AppChatHeader[]) {
    this.activeChatSessions = [];
    chatHeaders.forEach(chatItem => {
      let _chat: ChatSession = { chatId: chatItem.chatId, chatUsers: [] };
      chatItem.chatUsers.forEach(empId => {
        const employee = this.employeeNames.filter(item => item.id === empId);
        if (employee.length > 0) {
          _chat.chatUsers.push({
            id: employee[0].id,
            fullName: employee[0].name,
            image: employee[0].photoName,
            status: "online"
          });
        }
      });
      this.activeChatSessions.push(_chat);
    });
    this.setDefaultChat();
  }

  getChatSessions() {
    this.appMessageSvc
      .getAllChatMessagesByEmployeeId(this.userSession.employeeId)
      .subscribe(
        (data: AppChatHeader[]) => {
          if (!!data) {
            this.chatHeaders = data;
            this.mapChatHeaderToContacts(data);
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.GetAllChatHeadersFailed
          );
        }
      );
  }

  mapChatDetailToDiscussion(details: AppChatDetail[]) {
    this.discussions = [];
    details.forEach(item => {
      const singleUser = this.employeeNames.filter(
        data => data.id === item.userId
      );
      if (singleUser.length > 0) {
        let singleDiscussion: ChatDiscussion = {
          id: item.id,
          message: item.message,
          date: this.parseDate(item.dateCreated, 1),
          contactInfo: {
            id: singleUser[0].id,
            image: singleUser[0].photoName,
            fullName: singleUser[0].name,
            status: "online"
          },
          senderInfo: item.userId === this.userSession.employeeId ? true : false
        };
        this.discussions.push(singleDiscussion);
      }
    });
  }

  getChatDiscussions(chatId: string) {
    this.activeChatId = chatId;
    this.spinnerService.show();
    this.appMessageSvc
      .getChatDetailByChatId(chatId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: AppChatDetail[]) => {
          if (!!data) {
            this.mapChatDetailToDiscussion(data);
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.GetAllChatDetailFailed
          );
        }
      );
  }
}
