import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  AlertService,
  ProgressSpinnerService,
  MediaService,
  PhysicianService
} from "service-lib";
import { Router } from "@angular/router";
import {
  EditHelperUserAction,
  EditHelperActionType,
  UserSession,
  Physician
} from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "physician-detail",
  templateUrl: "./physician-detail.component.html"
})
export class OrgPhysicianDetailComponent implements OnInit {
  saveStatus1: boolean = false;
  saveStatus2: boolean = false;
  saveStatus3: boolean = false;
  saveStatus4: boolean = false;
  isLoading: boolean = false;
  activeCompanyId: string;
  states: any[];
  imguser1: any;
  userSession: UserSession;

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private physicianService: PhysicianService,
    private alertService: AlertService,
    private mediaService: MediaService,
    private spinnerService: ProgressSpinnerService
  ) {
    this.imguser1 = this.mediaService.defaultUserImage;
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
  }

  initValues() {
    this.physicianService.allphysicians = [];
  }

  handleStep1(event: EditHelperUserAction) {
    this.saveStatus1 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus1 = true;
        this.updatePhysician();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus1 = true;
        this.deletePhysician();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus1 = true;
        this.activatePhysician();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }
  handleStep2(event: any) {
    this.saveStatus2 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus2 = true;
        this.updatePhysician();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus2 = true;
        this.deletePhysician();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus2 = true;
        this.activatePhysician();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }
  handleStep3(event: any) {
    this.saveStatus3 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus3 = true;
        this.updatePhysician();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus3 = true;
        this.deletePhysician();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus3 = true;
        this.activatePhysician();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }
  handleStep4(event: any) {
    this.saveStatus4 = false;
    switch (event.actionType) {
      case EditHelperActionType.update: {
        this.saveStatus4 = true;
        this.updatePhysician();
        break;
      }
      case EditHelperActionType.delete: {
        this.saveStatus4 = true;
        this.deletePhysician();
        break;
      }
      case EditHelperActionType.reActivate: {
        this.saveStatus4 = true;
        this.activatePhysician();
        break;
      }
      default: {
        this.notifyService.notify(
          "error",
          "Invalid Operation",
          "Invalid operation encountered by the application. EditHelperUserAction"
        );
        break;
      }
    }
  }

  private updatePhysician() {
    this.spinnerService.show();
    let ret = this.physicianService
      .updatePhysician(this.physicianService.physician)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let x: any = data;
          this.savePhysicianUpdateDT();
          this.spinnerService.hide();
        },
        error => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }

  private activatePhysician() {
    this.physicianService.physician.isActive = true;
    this.spinnerService.show();
    let ret = this.physicianService
      .updatePhysician(this.physicianService.physician)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Physician = data;
          this.notifyService.notify(
            "success",
            "Update Personnel",
            "Physician ReActivated successfully"
          );
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }

  private deletePhysician() {
    this.spinnerService.show();
    this.physicianService.physician.isActive = false;
    let ret = this.physicianService
      .updatePhysician(this.physicianService.physician)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Physician = data;
          this.notifyService.notify(
            "success",
            "Update Personnel",
            "Physician DeActivated successfully"
          );
          this.spinnerService.hide();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }

  private savePhysicianUpdateDT() {
    if (this.physicianService.isNewPhysician) {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Physician added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Personnel",
        "Physician updated successfully"
      );
    }
  }
}
