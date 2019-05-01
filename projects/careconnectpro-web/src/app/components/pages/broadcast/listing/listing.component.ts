import { Component, OnInit } from "@angular/core";
import {
  SystemBroadcastHeader,
  UserSession,
  Message,
  APIUrls
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
  selector: "app-listing-broadcast-component",
  templateUrl: "./listing.component.html"
})
export class ListingComponent extends BaseComponent implements OnInit {
  broadcasts: SystemBroadcastHeader[] = [];
  selectedBroadcast: SystemBroadcastHeader[] = [];
  userSession: UserSession;

  constructor(
    private employeeService: EmployeeService,
    private spinnerService: ProgressSpinnerService,
    private authService: AuthService,
    private mediaSvc: MediaService,
    private dataService: DataService,
    private notifyService: NotificationsService
  ) {
    super();
  }

  /**
   * Method - Life cycle hook - component initialization
   */
  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    if (!!this.userSession) {
      this.initComponentData();
    }
    this.getLoggedInUserInfo();
  }

  /**
   * Method - Get logged in user data
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
   * Method - Init component data
   */
  initComponentData() {
    if (!!this.userSession) {
      this.getEmployeeNames();
    }
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
   * Method - Handle event - checkbox checked
   * @param id
   */
  onChangeCheckbox(id) {
    let index = this.selectedBroadcast.findIndex(x => x.id === id);
    if (index > 0) {
      this.selectedBroadcast.splice(index, 1);
    } else {
      let item = this.broadcasts.find(x => x.id === id);
      this.selectedBroadcast.push(item);
    }
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
          this.getAllSystemBroadcast();
        },
        (error: any) => {
          console.log(Message.ErrorEmployeeRetrieveEmployeeNames);
        }
      );
  }

  /**
   * Method - Retrieve all system broadcast messages for the company id
   */
  getAllSystemBroadcast() {
    this.spinnerService.show();
    let systemBroadcastHeader: SystemBroadcastHeader = {};
    let ret = this.dataService
      .getAllData(
        systemBroadcastHeader,
        this.userSession.companyId,
        APIUrls.SystemBroadcastGetAllMessagesByCompanyId
      )
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: SystemBroadcastHeader[] = data;
          if (ret != undefined) {
            this.broadcasts = ret;
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
   * Method - Return a formatted datatime string
   * @param dateIn
   */
  formatDate(dateIn: Date) {
    let dateFormat = require("dateformat");
    return dateFormat(dateIn, "dddd, mmmm dS, yyyy, h:MM:ss TT");
  }
}
