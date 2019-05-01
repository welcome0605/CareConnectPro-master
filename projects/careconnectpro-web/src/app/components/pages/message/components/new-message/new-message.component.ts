import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { ActivatedRoute, Params } from "@angular/router";
import {
  UserSession,
  AppMessageDetail,
  Message,
  APIUrls,
  EmployeeName
} from "model-lib";
import {
  AppMessageService,
  ProgressSpinnerService,
  AuthService,
  NotificationsService,
  EmployeeService,
  MediaService
} from "service-lib";
import { Router } from "@angular/router";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";

@Component({
  selector: "app-new-message-component",
  templateUrl: "./new-message.component.html"
})
export class NewMessageComponent implements OnInit {
  userSession: UserSession;
  appUserMessage: AppMessageDetail;
  form: FormGroup;
  files = Array<any>();
  originalMessageId: string; // type message ex : inbox ..
  responseType: string;
  recipients: string[] = [];
  employeeNames: EmployeeName[];
  activeMessageDetail: AppMessageDetail;
  emailToNames: string[] = [];
  availEmployeeNames: string[] = [];
  mediaurl: string;
  mediaEditorUrl: string;
  public config: DropzoneConfigInterface;

  @ViewChild("drpzone") drpzone: any;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "20rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    uploadUrl: null
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinnerService: ProgressSpinnerService,
    private appMessageService: AppMessageService,
    private authService: AuthService,
    private notifyService: NotificationsService,
    private router: Router,
    private employeeService: EmployeeService,
    private mediaService: MediaService
  ) {
    this.form = this.createFormGroup();
    this.responseType = activatedRoute.snapshot.data.responseType;
  }

  ngOnInit() {
    //instantiate the app message request
    this.activeMessageDetail = {};
    this.userSession = this.authService.getUserLoggedIn();
    this.getUrlParams();
    this.getEmployeeNames();
    this.initDropZoneConfig();
  }

  initDropZoneConfig() {
    this.mediaurl =
      APIUrls.MediaAttachmentPreview + "/" + this.userSession.companyId;
    this.mediaEditorUrl =
      APIUrls.MediaAttachmentEditorPreview + "/" + this.userSession.companyId;
    this.config = {
      clickable: true,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      url: null
    };
    this.config.url = this.mediaurl;
    this.editorConfig.uploadUrl = this.mediaEditorUrl;
  }

  getUrlParams() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.originalMessageId = params["id"];
    });
    this.activatedRoute.data.subscribe((data: any) => {
      this.responseType = data["responseType"];
    });
    this.activeMessageDetail = this.appMessageService.getActiveMessageDetail();
  }

  getActiveMessage() {
    switch (this.responseType) {
      case "reply":
        this.initReplyContent();
        break;
      case "forward":
        this.initForwardContent();
        break;
      default:
        this.initNewContent();
        break;
    }
  }

  initNewContent() {
    const newAppMessageDetail = {};
    this.activeMessageDetail = {};
    this.appMessageService.setActiveMessageDetail(newAppMessageDetail);
    this.activeMessageDetail.subject = "";
    this.form.controls["content"].setValue("");
  }

  search(event) {
    this.availEmployeeNames = [];
    const searchStr: string = event.query;
    const tmpList = this.employeeNames.filter(
      item => item.name.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
    );
    this.availEmployeeNames = tmpList.map((employee, index, array) => {
      return employee.name;
    });
  }

  handleDropdown(event) {
    //event.query = current value in input field
  }

  initReplyContent() {
    this.activeMessageDetail.subject = "Re:" + this.activeMessageDetail.subject;
    const preMesg: string = "<br><hr>" + this.activeMessageDetail.message;
    this.form.controls["content"].setValue(preMesg);
    let toList: string[] = [];
    toList.push(
      this.getEmployeeNameFromList(this.activeMessageDetail.senderId)
    );
    this.form.controls["subject"].setValue(this.activeMessageDetail.subject);
    this.form.controls["emailToNames"].setValue(toList);
  }

  getEmployeeNameFromList(empId: string) {
    const emp = this.employeeNames.find(item => item.id === empId);
    if (emp != undefined) {
      return emp.name;
    } else {
      return "";
    }
  }

  getEmployeeIdFromList(empName: string) {
    const emp = this.employeeNames.find(item => item.name === empName);
    if (emp != undefined) {
      return emp.id;
    } else {
      return "";
    }
  }

  initForwardContent() {
    this.activeMessageDetail.subject = "Fw:" + this.activeMessageDetail.subject;
    const preMesg: string = "<br><hr>" + this.activeMessageDetail.message;
    this.form.controls["content"].setValue(preMesg);
    this.form.controls["subject"].setValue(this.activeMessageDetail.subject);
    if (this.activeMessageDetail.fileAttachments.length > 0) {
      this.insertAttachment2DropZone();
    }
  }

  insertAttachment2DropZone() {
    if (this.appUserMessage.fileAttachments === undefined) {
      this.appUserMessage.fileAttachments = [];
    }

    this.activeMessageDetail.fileAttachments.forEach(attachFile => {
      this.appUserMessage.fileAttachments.push({
        id: attachFile.id,
        originalName: attachFile.originalName,
        fileSize: attachFile.fileSize
      });

      // Create the mock file:
      var mockFile = {
        name: attachFile.originalName.trim(),
        size: attachFile.fileSize
      };

      // Call the default addedfile event handler

      var dropZoneRef = this.drpzone.directiveRef.dropzone();
      dropZoneRef.emit("addedfile", mockFile);

      // And optionally show the thumbnail of the file:

      if (this.isAttachmentImage(attachFile.id)) {
        dropZoneRef.emit(
          "thumbnail",
          mockFile,
          this.getAttachmentUrl(attachFile.id, attachFile.originalName)
        );
        dropZoneRef.createThumbnailFromUrl(
          attachFile.originalName.trim(),
          this.getAttachmentUrl(attachFile.id, attachFile.originalName)
        );
      }

      // Make sure that there is no progress bar, etc...
      dropZoneRef.emit("complete", mockFile);
    });
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

  getEmployeeNames() {
    this.spinnerService.show();
    let ret = this.employeeService
      .getAllEmployeeNames(this.userSession.companyId)
      .finally(() => {
        this.spinnerService.hide();
        this.getActiveMessage();
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

  initMessage() {
    if (
      this.originalMessageId === undefined ||
      this.originalMessageId === null
    ) {
      this.appUserMessage = {};
    }
  }

  /**
   * create event form group
   * @returns {FormGroup}
   */
  private createFormGroup() {
    return new FormGroup({
      subject: new FormControl("", Validators.compose([Validators.required])),
      content: new FormControl("", Validators.compose([Validators.required])),
      emailToNames: new FormControl(
        "",
        Validators.compose([Validators.required])
      )
    });
  }

  /**
   *
   * Save Draft
   */
  saveDraft() {
    let values = this.form.value;
    this.appUserMessage.message = values.content;
    this.appUserMessage.subject = values.subject;
    this.appUserMessage.isRead = false;
    this.appUserMessage.senderId = this.userSession.employeeId;
    const toNames: string[] = values.emailToNames;
    toNames.forEach(item => {
      const employee = this.employeeNames.find(emp => emp.name === item);
      if (employee != undefined) {
        this.recipients.push(employee.id);
      }
    });
    this.appUserMessage.recipients = this.recipients;

    this.spinnerService.show();
    let ret = this.appMessageService
      .SendMessage(this.appUserMessage)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let ret: any = data;
          //this.router.navigate(['home/message/mail/draft']);
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.SendMessageFailedGeneralError
          );
        }
      );
  }

  /**
   * reset dropzone
   */
  resetDropzone() {
    this.drpzone.directiveRef.reset();
    this.form.reset();
    this.router.navigate(["home/message/mail/inbox"]);
  }

  /**
   * send message
   */
  onSendMessage() {
    let values = this.form.value;
    this.appUserMessage.message = values.content;
    this.appUserMessage.subject = values.subject;
    this.appUserMessage.isRead = false;
    this.appUserMessage.senderId = this.userSession.employeeId;
    const toNames: string[] = values.emailToNames;
    toNames.forEach(item => {
      const employee = this.employeeNames.find(emp => emp.name === item);
      if (employee != undefined) {
        this.recipients.push(employee.id);
      }
    });
    this.appUserMessage.recipients = this.recipients;

    this.spinnerService.show();
    let ret = this.appMessageService
      .SendMessage(this.appUserMessage)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let ret: any = data;
          if (this.appUserMessage.fileAttachments != undefined) {
            this.saveAttachment();
          } else {
            this.router.navigate(["home/message/mail/inbox"]);
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.SendMessageFailedGeneralError
          );
        }
      );
  }

  saveAttachment() {
    const fileAttachments: string[] = this.appUserMessage.fileAttachments.map(
      (value, index, array) => {
        return value.id;
      }
    );

    this.spinnerService.show();
    let ret = this.mediaService
      .mediaAttachmentSave(this.userSession.companyId, fileAttachments)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let ret: any = data;
          this.router.navigate(["home/message/mail/inbox"]);
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.SendMessageFailedGeneralError
          );
        }
      );
  }

  /**
   * error upload image
   * @param event
   */
  onUploadError(event) {
    let x: any = event;
  }

  /**
   * upload success
   * @param event
   */
  onUploadSuccess(event) {
    let x: any = event;
    const fileId: string = event[1];
    const origFileName: string = event[0].name;
    const tmpfileSize: string = event[0].size;
    if (this.appUserMessage.fileAttachments === undefined) {
      this.appUserMessage.fileAttachments = [];
    }
    this.appUserMessage.fileAttachments.push({
      id: fileId,
      originalName: origFileName,
      fileSize: tmpfileSize
    });
  }

  onRemovedFile(event) {
    const fileName: string = event.name.trim();
    const idx: number = this.appUserMessage.fileAttachments.findIndex(
      item => item.originalName.trim() === fileName
    );
    if (idx > -1) {
      this.appUserMessage.fileAttachments.splice(idx, 1);
    }
  }
}
