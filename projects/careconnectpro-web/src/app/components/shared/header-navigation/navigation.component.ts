import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  CareConnectLocalStorage,
  MediaService,
  AppHtmlControlService,
  SignalrhubService,
  NotificationsService,
  AppMessageService
} from "service-lib";
import {
  UserLogin,
  APIUrls,
  Mail,
  Notification,
  File,
  UserSession,
  AppChatHeader
} from "model-lib";
import { Router, NavigationExtras } from "@angular/router";
import { BaseComponent } from "../core";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "ma-navigation",
  templateUrl: "./navigation.component.html"
})
export class NavigationComponent extends BaseComponent implements OnInit {
  static mail: Array<Mail>;

  logolighttext: string = APIUrls.GetCdnServer + "/images/logo-light-text.png";
  logotext: string = APIUrls.GetCdnServer + "/images/logo-text.png";
  logolighticon: string = APIUrls.GetCdnServer + "/images/logo-light-icon.png";
  logoicon: string = APIUrls.GetCdnServer + "/images/logo-icon.png";

  imguser1: string = APIUrls.GetCdnServer + "/images/logo-light-icon.png";
  imguser2: string = APIUrls.GetCdnServer + "/images/logo-light-icon.png";
  imguser3: string = APIUrls.GetCdnServer + "/images/logo-light-icon.png";
  imguser4: string = APIUrls.GetCdnServer + "/images/logo-light-icon.png";

  imguserbig1: string = APIUrls.GetCdnServer + "/images/logo-light-icon.png";
  imguserbig2: string = APIUrls.GetCdnServer + "/images/logo-light-icon.png";
  imguserbig3: string =
    APIUrls.GetCdnServer + "/assets/images/logo-light-icon.png";
  loginToken: UserLogin;

  imgSrc: any;
  imgAltText: string = "";

  currentUser: any;
  currFullName: string;
  currEmail: string;

  notifications: Array<Notification>;
  userSession: UserSession;

  constructor(
    public authService: AuthService,
    public localstore: CareConnectLocalStorage,
    private router: Router,
    private notifyService: NotificationsService,
    private apphtmlcontrol: AppHtmlControlService,
    private mediaSvc: MediaService,
    private chatHub: SignalrhubService,
    private appMessageSvc: AppMessageService
  ) {
    super();
    NavigationComponent.mail = Array<Mail>();
    this.notifications = Array<Notification>();
  }

  initComponentData() {
    this.userSession = this.authService.getUserLoggedIn();
    this.currFullName = this.userSession.fullName;
    if (
      this.userSession.employeePhotoName != undefined &&
      this.userSession.employeePhotoName != null &&
      this.userSession.employeePhotoName != ""
    ) {
      this.imgSrc =
        APIUrls.GetImageEmployee + "/" + this.userSession.employeePhotoName;

      this.imgAltText = this.currFullName + "profile pic";
    } else {
      this.imgSrc = this.mediaSvc.defaultUserImage;
    }
    let files = new Array<File>();
    files.push({
      id: 1,
      path:
        "https://i2.wp.com/beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg?w=640&ssl=1"
    });
    NavigationComponent.mail = [];
    this.notifications = [];

    //start chart monitoring
    this.startChatHub();
  }
  ngOnInit() {
    this.getLoggedInUserInfo();
  }

  DisplayDashboard() {
    this.router.navigateByUrl("/dashboard");
  }

  getMails() {
    return NavigationComponent.mail;
  }

  getLoggedInUserInfo() {
    this.authService.userSessionSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.userSession = data;
        this.apphtmlcontrol.loadAppTheme(this.userSession.theme);
        this.initComponentData();
      });
  }

  startChatHub() {
    this.chatHub.connectChatHub();
    this.chatHub
      .listenChatMessages(this.userSession.employeeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((chatMsg: AppChatHeader) => {
        this.notifyService.notify("info", "Chat", "Message Received");
        this.appMessageSvc.chatMessageSubscription.next(chatMsg);
      });
  }
}
