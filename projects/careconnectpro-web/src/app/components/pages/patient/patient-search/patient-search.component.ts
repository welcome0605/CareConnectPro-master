import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  NotificationsService,
  ProgressSpinnerService,
  IcdOasisService,
  AlertService,
  PatientInTakeService,
  DataService,
  AuthService,
  MediaService
} from "service-lib";
import "rxjs/add/operator/finally";
import { Router } from "@angular/router";
import {
  Patient,
  IscMaster,
  UserSession,
  APIUrls,
  PatientHeader,
  Message
} from "model-lib";
import { SelectItem } from "primeng/primeng";
import { BaseComponent } from "../../../shared/core";
import { takeUntil } from "rxjs/operators";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-search",
  templateUrl: "./patient-search.component.html"
})
export class PatientSearchComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  title: string;
  subtitle: string;
  rootNode: any;
  activeCompanyId: string;
  patientRecords: Patient[] = [];
  selectedPatient: Patient;
  viewTypes: SelectItem[] = [];
  activeViewType: string;
  statusDropDownWidth: number = 0;
  sortF: any;
  term;
  type = "patient";
  userSession: UserSession = {};
  patients: PatientHeader[] = [];
  imguser1: any;

  /**
   * Method - Default constructor
   * @param dataService
   * @param spinnerService
   * @param ompService
   * @param alertService
   * @param route
   * @param intakeService
   * @param authService
   * @param notifyService
   */
  constructor(
    private dataService: DataService,
    private spinnerService: ProgressSpinnerService,
    private ompService: IcdOasisService,
    private alertService: AlertService,
    private route: Router,
    public intakeService: PatientInTakeService,
    private authService: AuthService,
    private notifyService: NotificationsService,
    private mediaService: MediaService
  ) {
    super();
    this.title = "User Profile";
    this.spinnerService.setMessage("Loading user profile page...");
    this.imguser1 = this.mediaService.defaultUserImage;
    this.spinnerService.show();
  }

  /**
   * Method - Life cycle hook - component init
   */
  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    //subscribe to logged in user observable
    this.getLoggedInUserInfo();
    this.getViewTypes();
    this.getStatusDropDownWidth();
    this.getAllPatients();
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
   * Method - Life cycle hook - component after view init
   */
  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  /**
   * Method - Get all patients for user
   */
  getAllPatients() {
    this.spinnerService.show();
    let patientHeader: PatientHeader = {};
    let ret = this.dataService
      .getAllData(
        patientHeader,
        this.userSession.companyId,
        APIUrls.PatientGetAllPatientHeaderCompanyId
      )
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          const ret: PatientHeader[] = data;
          if (ret != undefined) {
            this.patients = ret;
          }
        },
        error => {
          this.notifyService.notify(
            "error",
            "Message Error",
            Message.ErrorGetDatabaseRecordFailed + " Patients"
          );
        }
      );
  }

  getPatientImg(imgName: string) {
    return "";
  }

  /**
   * Method - Retrieve Oasis status code from database
   */
  getViewTypes() {
    this.spinnerService.show();
    let ret = this.ompService
      .getOasisStatusTypes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          const ret: IscMaster[] = data;
          this.populateViewTypeDropdown(ret);
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read oasis status codes. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Unable to read oasis status codes. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  populateViewTypeDropdown(statusList: IscMaster[]) {
    this.viewTypes = [];
    let y: any = statusList.sort(function(a: any, b: any) {
      return a.iscId > b.iscId ? 1 : b.iscId > a.iscId ? -1 : 0;
    });
    let z: any = y.map(function(stat: any) {
      return {
        label: stat.iscTxt,
        value: stat.iscId
      };
    });
    this.viewTypes.push({ label: "All status", value: "0" });
    z.forEach((stat: any) => {
      this.viewTypes.push({ label: stat.label, value: stat.value });
    });
    this.activeViewType = "0";
  }

  getStatusName(code: string): string {
    const idxStatus = this.viewTypes.findIndex(item => item.value === code);
    if (idxStatus > -1) {
      return this.viewTypes[idxStatus].label;
    } else {
      return "N/A";
    }
  }
  getpatientView() {
    //todo
  }

  getStatusDropDownWidth() {
    this.viewTypes.forEach(item => {
      if (item.label.length > this.statusDropDownWidth) {
        this.statusDropDownWidth = item.label.length;
      }
    });
  }

  startPatientIntake() {
    this.intakeService.updateIsNewPatient(true);
    this.route.navigate(["/home/patient/intake"]);
  }
}
