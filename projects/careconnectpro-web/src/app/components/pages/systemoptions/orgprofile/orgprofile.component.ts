import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  CompanyService,
  CareConnectLocalStorage,
  ProgressSpinnerService,
  AuthService
} from "service-lib";
import "rxjs/add/operator/finally";
import { UserSession } from "model-lib";
import { Router } from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-orgprofile",
  templateUrl: "./orgprofile.component.html",
  styleUrls: ["./orgprofile.component.css"]
})
export class OrgProfileComponent implements OnInit {
  title: string;
  subtitle: string;
  displaySubRenewal: boolean;
  displayContact: boolean = true;
  displaySubscription: boolean = false;
  displaySettings: boolean = false;

  companySubscriptions = this.companyService.companySubscriptions;
  rootNode: any;
  activeCompanyId: string;
  userSession: UserSession;

  constructor(
    public companyService: CompanyService,
    private localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    private authService: AuthService
  ) {
    this.title = "Agency Profile";
    this.spinnerService.setMessage("Loading organization management page...");
    this.spinnerService.show();
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.displayContact = true;
    this.displaySubscription = false;
    this.displaySettings = false;
  }

  ngAfterViewInit() {
    this.spinnerService.setMessage("");
    this.spinnerService.hide();
  }

  //get data for settings page
  getSettingsPage() {
    this.displayContact = false;
    this.displaySubscription = false;
    this.displaySettings = true;
  }

  //get data for contacts page
  getContactsPage() {
    this.displaySubscription = false;
    this.displaySettings = false;
    this.displayContact = true;
  }

  //get data for subscription page
  getSubsPage() {
    this.displaySettings = false;
    this.displayContact = false;
    this.displaySubscription = true;
  }
}
