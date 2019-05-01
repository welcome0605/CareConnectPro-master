import { NgModule } from "@angular/core";
import { OrgEmployeesComponent } from "./employees.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Personnel", url: "orgprofile" },
        { title: "Employees" }
      ]
    },
    component: OrgEmployeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgEmployeesRoutingModule {}
