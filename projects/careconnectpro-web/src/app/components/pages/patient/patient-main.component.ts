import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  CompanyService,
  CareConnectLocalStorage,
  ProgressSpinnerService
} from "service-lib";
import "rxjs/add/operator/finally";
import { Router } from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "patient-main",
  templateUrl: "./patient-main.component.html"
})
export class PatientMainComponent implements OnInit, AfterViewInit {
  tabView: number = 1;

  title: string;
  subtitle: string;
  displayUserProfile: boolean = true;
  displayUserSetting: boolean = false;
  displayUserAlerts: boolean = false;

  companySubscriptions = this.companyService.companySubscriptions;
  rootNode: any;
  activeCompanyId: string;

  constructor(
    public companyService: CompanyService,
    public localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService
  ) {
    this.title = "User Profile";
    this.spinnerService.setMessage("Loading user profile page...");
    this.spinnerService.show();
  }

  ngOnInit() {
    //this.activeCompanyId = this.localstore.getCurrentCompanyId();
    this.displayUserProfile = true;
    this.displayUserSetting = false;
    this.displayUserAlerts = false;
  }

  ngAfterViewInit() {
    this.spinnerService.hide();
  }

  displayView(tabView: number) {
    this.tabView = tabView;
  }
}
