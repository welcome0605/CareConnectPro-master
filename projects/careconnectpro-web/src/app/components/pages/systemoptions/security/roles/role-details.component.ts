import { Component, OnInit, EventEmitter, ViewChild } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  SecurityService,
  AlertService,
  ProgressSpinnerService
} from "service-lib";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { UserSession, AppRole, AppRolePermission } from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "roles-details",
  templateUrl: "./role-details.component.html"
})
export class OrgRoleDetailsComponent implements OnInit {
  appRoles: AppRole[];
  appRole: AppRole = {};
  selectedRole: AppRole = {};
  isNewRole: boolean = false;
  newRole: boolean;
  activeCompanyId: string;
  isEditMode: boolean;
  appPermissions: AppRolePermission[];
  id: any;
  @ViewChild("f3") f3: NgForm;
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private securityService: SecurityService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.isEditMode = false;
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.parseUrlQuery();
    this.getAppRoles();
    this.getPermissionsByRole();
  }

  getTitle(): string {
    if (this.appRole.id != null && this.appRole.id !== "") {
      this.isNewRole = false;
      return "Edit Security Role";
    } else {
      this.isNewRole = true;
      return "Add New Security Role";
    }
  }

  getAppRoles() {
    this.spinnerService.show();
    let ret = this.securityService
      .getAllRoles(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: any = data;
          this.appRoles = ret;
          const idx: number = this.appRoles.findIndex(
            item => item.id === this.id
          );
          if (idx > -1) {
            this.appRole = this.appRoles[idx];
          }
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read roles. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  saveAppRole() {
    this.spinnerService.show();
    if (this.newRole) {
      this.appRole.companyId = this.activeCompanyId;
      let ret = this.securityService
        .addRole(this.appRole)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let ret: AppRole = data;
            this.saveRoleUpdateDT();
          },
          error => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );
    } else {
      let ret = this.securityService
        .updateAppRole(this.appRole)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let x: any = data;
            this.saveRoleUpdateDT();
          },
          error => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );
    }
  }

  updateAgencyInfo(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode = true;
        break;
      }
      case 4:
      case 2: {
        if (!this.isRoleNameExist()) {
          this.f3.ngSubmit.emit();
          if (this.f3.form.valid === false) {
            this.saveStatus2.emit(false);
            this.isEditMode = true;
          }
        }
        break;
      }
      case 3: {
        this.cancelEditMode();
        this.getAppRoles();
        break;
      }
      case 5: {
        if (!this.isPermissionsExistRole()) {
          this.deleteRole();
          this.routeToMain();
        }
        break;
      }
    }
  }

  saveUpdateRole() {
    this.saveStatus2.emit(true);
    this.saveAppRole();
    this.routeToMain();
  }

  routeToMain() {
    this.securityService.isAppRoleUpdated.emit(true);
    this.router.navigate(["/home/security"]);
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  isRoleNameExist(): boolean {
    if (this.isNewRole === true) {
      let idx: number = this.appRoles.findIndex(
        role => role.name === this.appRole.name
      );
      if (idx > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isPermissionsExistRole(): boolean {
    if (this.appPermissions.length > 0) {
      this.notifyService.notify(
        "error",
        "Delete Role",
        "Permissions exists for role, remove all permissions first."
      );
      return true;
    } else {
      return false;
    }
  }

  getPermissionsByRole() {
    if (
      this.appRole.id == null ||
      this.appRole.id == undefined ||
      this.appRole.id == ""
    ) {
      this.appPermissions = [];
    } else {
      this.spinnerService.show();
      let ret = this.securityService
        .getPermissionsByRole(this.appRole.id)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: any = data;
            this.appPermissions = ret;
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "Unable to read roles. Please contact Care Connect Pro service desk"
            );
            //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
          }
        );
    }
  }

  parseUrlQuery() {
    this.activeRoute.params.subscribe(parms => {
      this.id = parms["id"];
      this.updateView();
    });
  }

  updateView() {
    if (this.id === undefined || this.id === "") {
      this.newRole = true;
      this.isEditMode = true;
    } else {
      this.appRole.id = this.id;
      this.newRole = false;
    }
  }

  saveRoleUpdateDT() {
    if (this.isNewRole) {
      this.notifyService.notify(
        "success",
        "Update Security",
        "Role added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Security",
        "Role updated successfully"
      );
    }
  }

  deleteRole() {
    let ret = this.securityService
      .deleteRole(this.appRole)
      .finally(() => this.spinnerService.hide())
      .subscribe(
        (data: any) => {
          let ret: AppRole = data;
          this.appRole = {};
          this.saveRoleUpdateDT();
          this.notifyService.notify(
            "success",
            "Update Security",
            "Role deleted successfully"
          );
          this.alertRolesUpdate();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  alertRolesUpdate() {}
}
