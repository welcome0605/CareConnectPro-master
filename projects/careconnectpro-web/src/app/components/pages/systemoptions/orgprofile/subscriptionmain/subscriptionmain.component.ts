import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  CompanyService,
  NotificationsService,
  CareConnectLocalStorage,
  ProgressSpinnerService,
  AlertService,
  AuthService
} from "service-lib";
import {
  CompanySubscription,
  Company,
  APIUrls,
  UserLogin,
  UserSession
} from "model-lib";
import "rxjs/add/operator/finally";
import { Router } from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-subscriptionmain",
  templateUrl: "./subscriptionmain.component.html"
})
export class OrgSubscriptionComponent implements OnInit {
  title: string;
  subtitle: string;
  displaySubRenewal: boolean;
  companyInfo: Company;
  companySubscriptions = this.companyService.companySubscriptions;
  activeSubscription = this.companyService.activeSubscription;
  rootNode: any;
  selectedSubscription: CompanySubscription;
  isEditMode: boolean;
  activeCompanyId: string;
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  sortF2: any;
  errorMessage: string;
  stacked: boolean = false;
  userSession: UserSession;

  constructor(
    public companyService: CompanyService,
    private notifyservice: NotificationsService,
    public localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService
  ) {
    this.title = "Subscription Page";
    this.subtitle = "This is some text within a card block.";
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;

    this.displaySubRenewal = false;
    if (this.companySubscriptions != null) {
      this.setActiveSubscription();
    }
    this.isEditMode = false;

    this.getCompanySubscriptions();
  }

  setActiveSubscription() {
    let x: any = this.companyService.companySubscriptions.find(
      x => x.isActive == true
    );
    if (x != undefined) {
      this.companyService.activeSubscription = x;
    } else {
      this.companyService.activeSubscription = {};
    }
  }

  //get data for subscription page
  getSubsPage() {
    this.getCompanySubscriptions();
  }

  routeToRenewSubscription() {
    this.router.navigate(["/home/orgprofile/renew"]);
  }

  getCompanySubscriptions() {
    this.spinnerService.show();
    let ret = this.companyService
      .getCompanySubscriptionById(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let x: CompanySubscription[] = data;
          if (x.length > 0) {
            this.companyService.companySubscriptions = x;
            this.setActiveSubscription();
          }
        },
        (error: any) => {
          console.log(
            "OrgProfile Init - Error retrieving your company information. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  changeSortSubscription(event: any) {
    //todo for subscription
  }

  gotoRenew() {
    this.notifyservice.notify(
      "info",
      "Subscription",
      "Please select a monthly subscription package!"
    );
    this.displaySubRenewal = true;
  }
}
