import { NgModule } from "@angular/core";
import { OrgRolesComponent } from "./roles.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Security", url: "security" },
        { title: "Roles" }
      ]
    },
    component: OrgRolesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgRolesRoutingModule {}
