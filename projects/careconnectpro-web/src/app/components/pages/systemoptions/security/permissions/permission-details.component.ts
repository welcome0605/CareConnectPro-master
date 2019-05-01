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
import { UserSession, AppRole, AppAsset, AppRolePermission } from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "permission-detail",
  templateUrl: "./permission-details.component.html"
})
export class OrgPermissionDetailsComponent implements OnInit {
  appRoles: AppRole[];
  appAssets: AppAsset[];
  appAssets2: SelectItem[];

  appPermissions: AppRolePermission[];
  appAsset: AppAsset = {};

  appRoles2: SelectItem[];
  appRole: any;
  appPermission: AppRolePermission = {};
  activeRoleId: string;
  selectedAsset: string;
  isRoleActive: boolean = false;
  selectedPermission: AppRolePermission = {};
  isNewPermission: boolean = false;
  newPermission: boolean;
  activeCompanyId: string;
  isEditMode: boolean;
  id: any;
  @ViewChild("f2") f2: NgForm;
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    private router: Router,
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
    this.getAppRoles();
    this.parseUrlQuery();
    this.getAppAssets();
  }

  getTitle(): string {
    let title: string = "";
    let roleName: string = this.getRoleNameById(this.activeRoleId);
    if (roleName != "") {
      title += " for Role: " + roleName;
    }
    if (this.appPermission.id != null && this.appPermission.id !== "") {
      this.isNewPermission = false;
      return "Edit Security Permissions" + title;
    } else {
      this.isNewPermission = true;
      return "Add New Security Permissions" + title;
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
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus2.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode();
        this.getPermissionsByRole();
        break;
      }
      case 5: {
        this.deletePermission();
        this.routeToMain();
        break;
      }
    }
  }

  saveUpdatePermission() {
    this.saveStatus2.emit(true);
    this.saveAppPermission();
    this.routeToMain();
  }

  routeToMain() {
    this.securityService.isAppRoleUpdated.emit(true);
    this.router.navigate(["/home/security"]);
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  parseUrlQuery() {
    this.activeRoute.params.subscribe(parms => {
      this.activeRoleId = parms["roleid"];
      this.id = parms["permid"];
      this.getPermissionsByRole();
      this.updateView();
    });
  }

  updateView() {
    if (this.id === undefined || this.id === "") {
      this.newPermission = true;
      this.isEditMode = false;
    } else {
      this.appPermission.id = this.id;
      this.newPermission = false;
    }
  }

  getAssetNameById(assetId: string) {
    let ret: string = "";
    if (this.appAssets !== undefined) {
      let val: any = this.appAssets.find(s => s.id == assetId);
      if (val != undefined && val != null && val != "") {
        ret = val.name;
      }
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

  getRoleNameById(activeRoleId: string) {
    let ret: string = "";
    if (this.appRoles != undefined) {
      let idx: number = this.appRoles.findIndex(
        item => item.id === activeRoleId
      );
      if (idx > -1) {
        ret = this.appRoles[idx].name;
      }
    }
    return ret;
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
            const idx: number = this.appPermissions.findIndex(
              item => item.id === this.id
            );
            if (idx > -1) {
              this.appPermission = this.appPermissions[idx];
            }
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
        }
      );
  }

  populateAssetsDropDown() {
    this.appAssets2 = [];
    let tmpAssets: AppAsset[] = [];
    this.appAssets.forEach(asset => {
      tmpAssets.push(asset);
    });

    if (this.appPermissions !== undefined) {
      this.appPermissions.forEach(perm => {
        let idx: number = tmpAssets.findIndex(
          asset => asset.id === perm.assetId
        );
        if (idx > -1) {
          tmpAssets.splice(idx, 1);
        }
      });
    }

    let x: any = tmpAssets;
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

  findSelectedPermissionIndex(): number {
    return this.appPermissions.indexOf(this.selectedPermission);
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
    this.appPermission = {};
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
          this.appPermission = {};
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
