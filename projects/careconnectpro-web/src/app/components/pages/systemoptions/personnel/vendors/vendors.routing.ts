import { NgModule } from "@angular/core";
import { OrgVendorComponent } from "./vendors.component";
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
    component: OrgVendorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule {}
