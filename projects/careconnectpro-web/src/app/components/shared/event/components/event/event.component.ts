import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CalendarComponent } from "ng-fullcalendar";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import {
  EventType,
  UserSession,
  Message,
  AppEventBase,
  AppEventCompany,
  UiCalendarEvent,
  APIUrls,
  AppEventHeaderBase
} from "model-lib";
import {
  AuthService,
  ProgressSpinnerService,
  NotificationsService,
  DataService
} from "service-lib";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../../core";

@Component({
  selector: "app-event-component",
  templateUrl: "./event.component.html",
  styles: [".noDisplay { display: none; }"]
})
export class EventComponent extends BaseComponent implements OnInit {
  //calendarOptions: Options;
  calendarOptions: any;
  modalReference: NgbModalRef;
  events: UiCalendarEvent[] = [];
  dbEvents: AppEventHeaderBase[];
  form: FormGroup;
  event: any;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  @ViewChild("btnShowModal") btnShowModal: ElementRef;
  @Input() eventType: EventType;
  userSession: UserSession = {};

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "10rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    uploadUrl: "v1/images" // if needed
  };

  /**
   * Constructor
   * @param modalService
   * @param authService
   * @param spinnerService
   * @param eventService
   * @param notifyService
   */
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private spinnerService: ProgressSpinnerService,
    private notifyService: NotificationsService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.events = [];
    this.form = this.createFormGroup();
  }

  /**
   * Method - Life cycle hook - component initialization
   */
  ngOnInit() {
    this.getEventType();
    this.userSession = this.authService.getUserLoggedIn();
    if (!!this.userSession) {
      this.initComponentData();
    }
    //subscribe to logged in user observable
    this.getLoggedInUserInfo();
  }

  /**
   * Method - Init component data
   */
  initComponentData() {
    this.initCalenderOptions();
    if (!!this.userSession) {
      this.getEvents();
    }
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
   * Method - Get the event from activate route
   */
  getEventType() {
    const routeDate = this.activatedRoute.data.subscribe(data => {
      if (!!data.eventType) {
        switch (data.eventType) {
          case "personal":
            this.eventType = EventType.Personal;
            break;
          case "company":
            this.eventType = EventType.Company;
            break;
        }
      }
    });
  }
  /**
   * Method - Map database interface for events to interface for view
   */
  mapDbEventsCalendarEvents() {
    this.dbEvents.forEach(evt => {
      const uiEvent: UiCalendarEvent = this.mapDbEventToUiEvent(evt);
      this.events.push(uiEvent);
      this.ucCalendar.fullCalendar("renderEvent", uiEvent);
      this.ucCalendar.fullCalendar("rerenderEvents");
    });
  }

  /**
   * Method - Convert db personal and company interface to UI event interface
   * @param dbEvent
   */
  mapDbEventToUiEvent(dbEvent: any): UiCalendarEvent {
    let uiEvent: UiCalendarEvent = {};
    uiEvent.id = dbEvent.id;
    uiEvent.description = dbEvent.detail;
    uiEvent.title = dbEvent.title;
    uiEvent.start = new Date(dbEvent.startDate);
    (uiEvent.end = new Date(dbEvent.endDate)),
      (uiEvent.end_time = this.getFormattedTimeFromDate(uiEvent.end));
    uiEvent.start_time = this.getFormattedTimeFromDate(uiEvent.start);
    return uiEvent;
  }

  /**
   * Method - Derived UI formatted time value from date
   * @param dateVal
   */
  getFormattedTimeFromDate(dateVal: Date): string {
    let timeVal: string = "";
    if (!!dateVal) {
      timeVal =
        (dateVal.getHours() < 10
          ? "0" + dateVal.getHours().toString()
          : dateVal.getHours().toString()) +
        ":" +
        (dateVal.getMinutes() < 10
          ? "0" + dateVal.getMinutes().toString()
          : dateVal.getMinutes().toString()) +
        ":" +
        (dateVal.getMinutes() < 10
          ? "0" + dateVal.getMinutes().toString()
          : dateVal.getMinutes().toString());
    }
    return timeVal;
  }

  /**
   * Method - retrieve event data based on event type passed
   */
  getEvents() {
    switch (this.eventType) {
      case EventType.Personal:
        this.getAllPersonalEvents();
        break;
      case EventType.Company:
        this.getAllCompanyEvents();
        break;
      default:
        this.getAllPersonalEvents();
        break;
    }
  }

  /**
   * Get all personal or employee events
   */
  getAllPersonalEvents() {
    this.spinnerService.show();
    let appEventBase: AppEventHeaderBase = {};
    let ret = this.dataService
      .getAllData(
        appEventBase,
        this.userSession.employeeId,
        APIUrls.CalendarEventGetAllEmployeeEventsByEmployeeId
      )
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: AppEventHeaderBase[] = data;
          if (ret != undefined) {
            this.dbEvents = ret;
            this.mapDbEventsCalendarEvents();
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
   * Get all personal or employee events
   */
  getAllCompanyEvents() {
    this.spinnerService.show();
    let AppEventCompany: AppEventHeaderBase = {};
    let ret = this.dataService
      .getAllData(
        AppEventCompany,
        this.userSession.companyId,
        APIUrls.CalendarEventGetAllCompanyEventsByCompanyId
      )
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: AppEventHeaderBase[] = data;
          if (ret != undefined) {
            this.dbEvents = ret;
            this.mapDbEventsCalendarEvents();
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
   * create event form group
   * @returns {FormGroup}
   */
  private createFormGroup() {
    return new FormGroup({
      id: new FormControl(""),
      title: new FormControl("", Validators.compose([Validators.required])),
      start_date: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      start_time: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      end_date: new FormControl("", Validators.compose([Validators.required])),
      end_time: new FormControl("", Validators.compose([Validators.required])),
      description: new FormControl("")
    });
  }

  /**
   * Method - Initialize and setup calendar options
   */
  initCalenderOptions() {
    const self = this;
    this.calendarOptions = {
      customButtons: {
        newEventButton: {
          text: "Create event",
          click: function() {
            self.btnModalClick();
          }
        }
      },
      header: {
        left: "prev,next today newEventButton",
        center: "title",
        right: "month,agendaWeek,agendaDay,listMonth"
      },
      editable: false,
      eventLimit: false,
      events: this.events,
      timeFormat: "H(:mm)"
    };
  }

  /**
   * click modal
   */
  btnModalClick() {
    const el: HTMLElement = this.btnShowModal.nativeElement as HTMLElement;
    el.click();
  }

  /**
   * open modal
   */
  openModal(content) {
    this.modalReference = this.modalService.open(content);
  }

  /**
   * close modal
   */
  dismissModal() {
    this.form.reset();
    this.modalReference.close();
  }

  /**
   * get event
   */
  getEvent(detail) {
    this.event = detail;
    this.form.setValue({
      id: detail.event.id,
      title: detail.event.title,
      start_date: detail.event.start.format("YYYY-MM-DD"),
      start_time: detail.event.start_time,
      end_date: detail.event.end.format("YYYY-MM-DD"),
      end_time: detail.event.end_time,
      description:
        detail.event.description !== null ? detail.event.description : ""
    });
    this.btnModalClick();
  }

  /**
   * Method - Retrieve a single event details by event id
   * @param eventId
   */
  getEventPersonal(eventId: string) {
    const uiEvent = this.getUiEventDataFromForm();
    const dbEvt: AppEventBase = this.getDbEventFromUiEvent(uiEvent);
    this.spinnerService.show();
    let appEventBase: AppEventBase = {};
    let ret = this.dataService
      .getSingleData(appEventBase, eventId, APIUrls.CalendarEventEmployee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: AppEventBase = data;
          if (ret != undefined) {
            this.updateUI(eventId);
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
   * Add event
   */
  addEvent() {
    switch (this.eventType) {
      case EventType.Company:
        this.addEventCompany();
        break;
      case EventType.Personal:
        this.addEventPersonal();
        break;
    }
  }
  /**
   * add new event personal
   */
  addEventPersonal() {
    const uiEvent = this.getUiEventDataFromForm();
    const dbEvt: AppEventBase = this.getDbEventFromUiEvent(uiEvent);
    this.spinnerService.show();
    let ret = this.dataService
      .postData(dbEvt, APIUrls.CalendarEventEmployee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.updateUI(ret);
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
   * add new event company
   */
  addEventCompany() {
    const uiEvent = this.getUiEventDataFromForm();
    const dbEvt: AppEventCompany = this.getDbEventFromUiEvent(uiEvent);
    dbEvt.companyId = this.userSession.companyId;
    this.spinnerService.show();
    let ret = this.dataService
      .postData(dbEvt, APIUrls.CalendarEventCompany)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.updateUI(ret);
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
   * Method - Update company event
   */
  updateEventCompany(eventId: string) {
    const uiEvent = this.getUiEventDataFromForm();
    const dbEvt: AppEventCompany = this.getDbEventFromUiEvent(uiEvent);
    dbEvt.companyId = this.userSession.companyId;
    this.spinnerService.show();
    let ret = this.dataService
      .updateData(dbEvt, APIUrls.CalendarEventCompany)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.updateUI(eventId);
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
   * Method - Update personal event
   */
  updateEventPersonal(eventId: string) {
    const uiEvent = this.getUiEventDataFromForm();
    const dbEvt: AppEventCompany = this.getDbEventFromUiEvent(uiEvent);
    this.spinnerService.show();
    let ret = this.dataService
      .updateData(dbEvt, APIUrls.CalendarEventEmployee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.updateUI(eventId);
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
   * Method - Delete event from database
   * @param eventId
   */
  deleteEventEmployee(eventId: string) {
    this.spinnerService.show();
    let ret = this.dataService
      .deleteData(eventId, APIUrls.CalendarEventEmployee)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.removeEventUI(eventId);
            this.resetForm();
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
   * Method - Delete event from database
   * @param eventId
   */
  deleteEventCompany(eventId: string) {
    this.spinnerService.show();
    let ret = this.dataService
      .deleteData(eventId, APIUrls.CalendarEventCompany)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: string = data;
          if (ret != undefined) {
            this.removeEventUI(eventId);
            this.resetForm();
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
   * Method - Convert Interface used for view data to interface that will passed to the database
   * @param uiEvt
   */
  getDbEventFromUiEvent(uiEvt: UiCalendarEvent): any {
    let evt: any = {};
    switch (this.eventType) {
      case EventType.Company:
        const evtCompany: AppEventCompany = {
          companyId: this.userSession.companyId,
          id: uiEvt.id,
          userId: this.userSession.employeeId,
          title: uiEvt.title,
          startDate: uiEvt.start,
          endDate: uiEvt.end,
          detail: uiEvt.description,
          fileAttachments: [],
          dateCreated: new Date(),
          lastUpdatedDate: new Date(),
          lastUpdatedUser: this.userSession.employeeId
        };
        evt = evtCompany;
        break;
      case EventType.Personal:
        const evtPersonal: AppEventBase = {
          id: uiEvt.id,
          userId: this.userSession.employeeId,
          title: uiEvt.title,
          startDate: uiEvt.start,
          endDate: uiEvt.end,
          detail: uiEvt.description,
          fileAttachments: [],
          dateCreated: new Date(),
          lastUpdatedDate: new Date(),
          lastUpdatedUser: this.userSession.employeeId
        };
        evt = evtPersonal;
        break;
    }
    return evt;
  }

  /**
   * get ui event type from form
   */
  getUiEventDataFromForm() {
    let evt: UiCalendarEvent = {
      id: this.form.value.id,
      start: new Date(
        this.form.value.start_date + " " + this.form.value.start_time
      ),
      start_time: this.form.value.start_time,
      end: new Date(this.form.value.end_date + " " + this.form.value.end_time),
      end_time: this.form.value.end_time,
      title: this.form.value.title,
      description: this.form.value.description
    };
    return evt;
  }
  /**
   * update event
   */
  updateEvent() {
    const eventId: string = this.form.value.id;
    switch (this.eventType) {
      case EventType.Personal:
        this.updateEventPersonal(eventId);
        break;
      case EventType.Company:
        this.updateEventCompany(eventId);
        break;
    }
  }

  /**
   * create event
   */
  private updateUI(id: string) {
    this.removeEventUI(id);
    let evt: UiCalendarEvent = {
      id: id,
      start: new Date(
        this.form.value.start_date + " " + this.form.value.start_time
      ),
      start_time: this.form.value.start_time,
      end: new Date(this.form.value.end_date + " " + this.form.value.end_time),
      end_time: this.form.value.end_time,
      title: this.form.value.title,
      description: this.form.value.description
    };
    this.events.push(evt);
    this.ucCalendar.fullCalendar("renderEvent", evt);
    this.ucCalendar.fullCalendar("rerenderEvents");
    this.dismissModal();
  }

  /**
   * remove event from UI
   */
  private removeEventUI(id: string) {
    let index = this.events.findIndex(x => x.id === id);
    if (index > -1) {
      this.events.splice(index, 1);
      this.ucCalendar.fullCalendar("removeEvents");
      this.ucCalendar.fullCalendar("addEventSource", this.events);
    }
  }

  /**
   * Reset Form and dismiss modal
   */
  private resetForm() {
    this.form.reset();
    this.dismissModal();
  }

  /**
   * delete event
   */
  deleteEvent() {
    const eventId = this.form.value.id;

    switch (this.eventType) {
      case EventType.Personal:
        this.deleteEventEmployee(eventId);
        break;
      case EventType.Company:
        this.deleteEventCompany(eventId);
        break;
    }
  }
}
