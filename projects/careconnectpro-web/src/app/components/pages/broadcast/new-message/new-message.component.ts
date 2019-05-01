import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import {
  SystemBroadcastHeader,
  UserSession,
  Message,
  APIUrls,
  SystemBroadcastDetail
} from "model-lib";
import {
  EmployeeService,
  ProgressSpinnerService,
  AuthService,
  MediaService,
  DataService,
  NotificationsService
} from "service-lib";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../../shared/core";

@Component({
  selector: "app-broadcast-component",
  templateUrl: "./new-message.component.html",
  styles: [
    ".alert{position: fixed;top: 0;width: 100%;left: 0;z-index: 100;height: 69.5px}"
  ]
})
export class NewMessageComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  messageAlert: string;
  imageAlert: string;
  messageDetail: SystemBroadcastDetail = {};
  userSession: UserSession;
  isSubmitted: boolean = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "20rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    uploadUrl: "v1/images"
  };

  /**
   * Method - Constructor
   */
  constructor(
    private employeeService: EmployeeService,
    private spinnerService: ProgressSpinnerService,
    private authService: AuthService,
    private mediaSvc: MediaService,
    private dataService: DataService,
    private notifyService: NotificationsService,
    private router: Router
  ) {
    super();
  }

  /**
   * Method - Life cycle hook - Component initialization
   */
  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.getLoggedInUserInfo();
    this.form = this.createFormGroup();
    this.messageAlert = "";
    this.isSubmitted = false;
  }

  /**
   * Method - Get logged in user data
   */
  getLoggedInUserInfo() {
    this.authService.userSessionSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.userSession = data;
      });
  }

  /**
   * Method - Create event form group
   * @returns {FormGroup}
   */
  private createFormGroup() {
    return new FormGroup({
      messageTitle: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      content: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  /**
   * Method - Data service call to save message
   */
  onSendMessage() {
    let values = this.form.value;
    this.messageDetail.message = values.content;
    this.messageDetail.senderId = this.userSession.employeeId;
    this.messageDetail.subject = values.messageTitle;
    this.messageDetail.companyId = this.userSession.companyId;
    this.messageDetail.fileAttachments = [];
    this.spinnerService.show();
    let ret = this.dataService
      .postData(this.messageDetail, APIUrls.SystemBroadcast)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.openAlert();
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.GetEventCalenderFailed
          );
        }
      );
  }

  /**
   * Method - Open alert message
   */
  openAlert() {
    this.isSubmitted = true;
    this.messageAlert = this.messageDetail.subject;
    this.form.reset();
  }

  /**
   * Method - CLear message alert on close
   */
  onCloseAlert() {
    this.messageAlert = "";
    this.imageAlert = "";
    this.router.navigate(["home/broadcast"]);
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
}
