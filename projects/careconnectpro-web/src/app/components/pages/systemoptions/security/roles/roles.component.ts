import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  AppHtmlControlService,
  NotificationsService,
  CareConnectLocalStorage,
  SecurityService,
  AlertService,
  ProgressSpinnerService
} from "service-lib";
import { Router } from "@angular/router";
import { UserSession, AppRole, AppRolePermission } from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "roles",
  templateUrl: "./roles.component.html"
})
export class OrgRolesComponent implements OnInit {
  appRoles: AppRole[];
  appRole: AppRole = {};
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  displayDialogRole: boolean;
  selectedRole: AppRole;
  isNewRole: boolean = false;
  newRole: boolean;
  activeCompanyId: string = "";
  appPermissions: AppRolePermission[];
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    public apphtmlcontrol: AppHtmlControlService,
    private securityService: SecurityService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.getAppRoles();
    this.securityService.isAppRoleUpdated.subscribe((event: boolean) => {
      if (event === true) {
        this.getAppRoles();
      }
    });
  }

  routeAddRole() {
    this.router.navigate([
      "/home/security/role",
      this.appRole.id ? this.appRole.id : ""
    ]);
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
          this.getAllPermissions();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read roles. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  changeSortAddress(event: any) {
    if (!event.order) {
      this.sortF = "name";
    } else {
      this.sortF = event.field;
    }
  }

  changeSortRoles(event: any) {}

  onRowSelectRole(event: any) {
    this.isNewRole = false;
    this.newRole = false;
    this.appRole = this.cloneRole(event.data);
    this.routeAddRole();
  }

  cloneRole(a: AppRole): AppRole {
    let approle: any;
    let y: any = a;
    for (let prop in a) {
      approle[prop] = y[prop];
    }
    return approle;
  }

  getPermissionsCountByRole(roleId: string): number {
    let permCount: number = 0;
    let permRec: AppRolePermission[] = this.appPermissions.filter(
      item => item.roleId === roleId
    );
    if (permRec != undefined) {
      permCount = permRec.length;
    }
    return permCount;
  }

  getAllPermissions() {
    this.appPermissions = [];
    this.appRoles.forEach(role => {
      this.getPermissionsByRole(role.id);
    });
  }

  getPermissionsByRole(roleId: string) {
    let ret = this.securityService
      .getPermissionsByRole(roleId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: AppRolePermission[] = [];
          ret = data;
          ret.forEach(mainPerm => {
            const x: number = this.appPermissions.findIndex(
              subPerm => subPerm.id === mainPerm.id
            );
            if (x < 0) {
              this.appPermissions.push(mainPerm);
            }
          });
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read roles. Please contact Care Connect Pro service desk"
          );
        }
      );
  }
}
