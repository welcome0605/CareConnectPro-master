import { Component, OnInit } from "@angular/core";
import {
  SystemBroadcastDetail,
  UserSession,
  APIUrls,
  Message
} from "model-lib";
import { ActivatedRoute, Params } from "@angular/router";
import { BaseComponent } from "../../../shared/core";
import {
  EmployeeService,
  ProgressSpinnerService,
  AuthService,
  MediaService,
  DataService,
  NotificationsService
} from "service-lib";

@Component({
  selector: "app-broadcast-detail-component",
  templateUrl: "./detail.component.html"
})
export class DetailComponent extends BaseComponent implements OnInit {
  broadcast: SystemBroadcastDetail = {};
  messageId: string;
  userSession: UserSession;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private spinnerService: ProgressSpinnerService,
    private authService: AuthService,
    private mediaSvc: MediaService,
    private dataService: DataService,
    private notifyService: NotificationsService
  ) {
    super();
  }

  ngOnInit() {
    this.parseUrlQuery();
  }

  /**
   * Method - Retrived message id from URL query parameters and retrieve message from database
   */
  parseUrlQuery() {
    this.activatedRoute.params.subscribe(parms => {
      this.messageId = parms["id"];
      this.getMessageDb();
    });
  }

  /**
   * Method - Retrieve single message from database
   */
  getMessageDb() {
    this.spinnerService.show();
    let ret = this.dataService
      .getSingleData(this.broadcast, this.messageId, APIUrls.SystemBroadcast)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: SystemBroadcastDetail = data;
          if (ret != undefined) {
            this.broadcast = ret;
          }
        },
        (error: any) => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.GetSystemBroadcastFailed
          );
        }
      );
  }

  /**
   * Method - Retrieve formatted full employee name from downloaded employee list
   * @param employeeId
   */
  getEmployeeFullName(employeeId: string) {
    let ret: string = "";
    const x = this.employeeService.employeeNames.findIndex(
      y => y.id === employeeId
    );
    if (x > -1) {
      ret = this.employeeService.employeeNames[x].name;
    }
    return ret;
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
