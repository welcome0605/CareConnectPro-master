import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  NotificationsService,
  CareConnectLocalStorage,
  ProgressSpinnerService
} from "service-lib";
import { EventType } from "model-lib";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "ea-dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  title: string;
  subtitle: string = "";
  schEvents: any;
  personalEvent: EventType = EventType.Personal;
  companyEvent: EventType = EventType.Company;

  constructor(
    public notificationsService: NotificationsService,
    public localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService
  ) {
    this.title = "Care Connect Pro - Home Page";
    this.spinnerService.setMessage("Loading dashboard page...");
    this.spinnerService.show();
  }

  ngAfterViewInit() {
    this.spinnerService.setMessage("");
    this.spinnerService.hide();
  }

  ngOnInit() {
    this.schEvents = [
      {
        title: "All Day Event",
        start: "2017-12-01"
      },
      {
        title: "Long Event",
        start: "2017-12-07",
        end: "2017-12-10"
      },
      {
        title: "Repeating Event",
        start: "2017-12-09T16:00:00"
      },
      {
        title: "Repeating Event",
        start: "2017-12-16T16:00:00"
      },
      {
        title: "Conference",
        start: "2017-12-11",
        end: "2017-12-13"
      }
    ];
  }
}
