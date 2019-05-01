import { NgModule } from "@angular/core";
import { OrgPermissionsComponent } from "./permissions.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Security", url: "security" },
        { title: "Permissions" }
      ]
    },
    component: OrgPermissionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgPermissionsRoutingModule {}
