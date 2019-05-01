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
import { Router, ActivatedRoute } from "@angular/router";
import { UserSession, AppRole, AppAsset, AppRolePermission } from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "permissions",
  templateUrl: "./permissions.component.html"
})
export class OrgPermissionsComponent implements OnInit {
  appRoles: AppRole[];
  selectedRole: AppRole = {};
  appAssets: AppAsset[];
  appAssets2: SelectItem[];

  appPermissions: AppRolePermission[];
  appAsset: AppAsset = {};

  appRoles2: SelectItem[];
  testdata: SelectItem[];
  appRole: AppRole = {};
  appPermission: AppRolePermission = {};
  activeRoleId: string = "";
  selectedAsset: string;
  isRoleActive: boolean = false;
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  displayDialogPermission: boolean;
  selectedPermission: AppRolePermission;
  isNewPermission: boolean = false;
  newPermission: boolean;
  activeCompanyId: string = "";
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    private securityService: SecurityService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.getAppRoles();
    this.getAppAssets();

    this.securityService.isAppRoleUpdated.subscribe((val: boolean) => {
      if (val === true) {
        this.getAppRoles();
      }
    });
  }

  changeSortPermissions(event: any) {}

  routeAddPermission() {
    this.router.navigate([
      "/home/security/permission",
      this.activeRoleId ? this.activeRoleId : 0,
      this.appPermission.id ? this.appPermission.id : ""
    ]);
  }

  getAssetNameById(assetId: string) {
    let ret: string = "";
    let val: any = this.appAssets.find(s => s.id == assetId);
    if (val != undefined && val != null && val != "") {
      ret = val.name;
    }
    return ret;
  }

  getAppRoles() {
    this.spinnerService.show();
    let ret = this.securityService
      .getAllRoles(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide;
      })
      .subscribe(
        (data: any) => {
          let ret: any = data;
          this.appRoles = ret;
          this.populateRolesDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read roles. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  getPermissionsByRole() {
    if (
      this.activeRoleId == null ||
      this.activeRoleId == undefined ||
      this.activeRoleId == ""
    ) {
      this.isRoleActive = false;
      this.appPermissions = [];
    } else {
      this.isRoleActive = true;
      this.spinnerService.show();
      let ret = this.securityService
        .getPermissionsByRole(this.activeRoleId)
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

  getAppAssets() {
    this.spinnerService.show();
    let ret = this.securityService
      .getAllAssets()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: any = data;
          this.appAssets = ret;
          this.populateAssetsDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read assets. Please contact Care Connect Pro service desk"
          );
          //console.log("Renew subscription failed. Please contact Care Connect Pro service desk.")
        }
      );
  }

  populateAssetsDropDown() {
    let x: any = this.appAssets;
    let y: any = x.sort(function(a: any, b: any) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    let z: any = y.map(function(asset: any) {
      return {
        label: asset.name,
        value: asset.id
      };
    });
    this.appAssets2 = z;
  }

  populateRolesDropDown() {
    let x: any = this.appRoles;
    let y: any = x.sort(function(a: any, b: any) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    let z: any = y.map(function(role: any) {
      return {
        label: role.name,
        value: role.id
      };
    });
    this.activeRoleId = "";
    this.appRoles2 = z;
    this.getPermissionsByRole();
  }

  changeSortAddress(event: any) {
    if (!event.order) {
      this.sortF = "name";
    } else {
      this.sortF = event.field;
    }
  }

  onRowSelectPermission(event: any) {
    this.isNewPermission = false;
    this.newPermission = false;
    this.appPermission = this.clonePermission(event.data);
    this.displayDialogPermission = true;
    this.routeAddPermission();
  }

  clonePermission(a: AppRolePermission): AppRolePermission {
    let apppermission: any = {};
    let y: any = a;
    for (let prop in a) {
      apppermission[prop] = y[prop];
    }
    return apppermission;
  }

  findSelectedPermissionIndex(): number {
    return this.appPermissions.indexOf(this.selectedPermission);
  }

  showPermissionDialogToAdd() {
    this.isNewPermission = true;
    this.newPermission = true;
    this.appPermission = {};
    this.displayDialogPermission = true;
  }

  saveAppPermission() {
    let apppermissions: AppRolePermission[] = [];
    if (this.appPermissions != undefined || this.appPermissions != null) {
      apppermissions = [...this.appPermissions];
    }

    if (this.newPermission) {
      this.spinnerService.show();
      this.appPermission.roleId = this.activeRoleId;
      let ret = this.securityService
        .addRolePermission(this.appPermission)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let ret: AppRolePermission = data;
            apppermissions.push(ret);
            this.savePermissionUpdateDT(apppermissions);
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
      this.spinnerService.show();
      let ret = this.securityService
        .updateAppRolePermission(this.appPermission)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let x: any = data;
            this.savePermissionUpdateDT(apppermissions);
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

      apppermissions[this.findSelectedPermissionIndex()] = this.appPermission;
    }
  }

  savePermissionUpdateDT(_appPermissions: AppRolePermission[]) {
    this.appPermissions = _appPermissions;
    this.appPermission = null;
    this.displayDialogPermission = false;

    if (this.isNewPermission) {
      this.notifyService.notify(
        "success",
        "Update Security",
        "Role Permission added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Security",
        "Role Permission updated successfully"
      );
    }
  }

  deletePermission() {
    let index = this.findSelectedPermissionIndex();
    let apppermissions: AppRolePermission[] = [];
    apppermissions = this.appPermissions.filter((val, i) => i != index);

    this.spinnerService.show();
    let ret = this.securityService
      .deleteRolePermission(this.appPermission)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: AppRolePermission = data;
          this.appPermission = null;
          this.displayDialogPermission = false;
          this.savePermissionUpdateDT(apppermissions);
          this.notifyService.notify(
            "success",
            "Update Security",
            "Role Permission deleted successfully"
          );
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
}
