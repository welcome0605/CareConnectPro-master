import { NgModule } from "@angular/core";
import { OrgSecurityComponent } from "./security.component";
import { OrgPermissionDetailsComponent } from "./permissions/permission-details.component";
import { OrgRoleDetailsComponent } from "./roles/role-details.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "service-lib";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Security Roles and Permissions" }
      ]
    },
    component: OrgSecurityComponent
  },
  {
    path: "permission/:roleid/:permid",
    component: OrgPermissionDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Security Roles and Permissions", url: "/home/security" },
        { title: "Manage Permissions" }
      ]
    }
  },
  {
    path: "role/:id",
    component: OrgRoleDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Organization Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Security Roles and Permissions", url: "/home/security" },
        { title: "Manage Role" }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgSecurityRoutingModule {}
