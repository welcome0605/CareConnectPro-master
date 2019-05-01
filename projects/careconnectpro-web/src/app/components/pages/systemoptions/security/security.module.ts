import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrgSecurityRoutingModule } from "./security.routing";
import { OrgPermissionsComponent } from "../security/permissions/permissions.component";
import { OrgPermissionDetailsComponent } from "../security/permissions/permission-details.component";
import { OrgRoleDetailsComponent } from "../security/roles/role-details.component";
import { OrgRolesComponent } from "../security/roles/roles.component";
import { OrgSecurityComponent } from "./security.component";
import { TableModule } from "primeng/components/table/table";
import { Ho2NgModule } from "../../../../modules/app.module.ho2ng";

import {
  DataTableModule,
  SharedModule,
  DialogModule,
  RadioButtonModule,
  ToggleButtonModule,
  FileUploadModule,
  OverlayPanelModule,
  DropdownModule,
  KeyFilterModule
} from "primeng/primeng";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    RadioButtonModule,
    ToggleButtonModule,
    FileUploadModule,
    OverlayPanelModule,
    DropdownModule,
    KeyFilterModule,
    TableModule,
    Ho2NgModule,
    OrgSecurityRoutingModule
  ],
  declarations: [
    OrgSecurityComponent,
    OrgRolesComponent,
    OrgPermissionsComponent,
    OrgRoleDetailsComponent,
    OrgPermissionDetailsComponent
  ]
})
export class OrgSecurityModule {}
