import { NgModule } from "@angular/core";
import { OrgProfileComponent } from "./orgprofile.component";
import { OrgMainAddressComponent } from "./main/orgmainaddress.component";
import { OrgMainDepartmentComponent } from "./main/orgmaindept.component";
import { SubscriptionPaidComponent } from "../../../../components/shared/subscription/subscription-paid.component";
import { AuthGuard } from "service-lib";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "System Options",
      urls: [{ title: "Dashboard", url: "/dashboard" }, { title: "My Agency" }]
    },
    component: OrgProfileComponent
  },
  {
    path: "dept/:id",
    component: OrgMainDepartmentComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "My Agency", url: "/home/orgprofile" },
        { title: "Manage Agency Department" }
      ]
    }
  },
  {
    path: "loc/:id",
    component: OrgMainAddressComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Organization Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "My Agency", url: "/home/orgprofile" },
        { title: "Manage Agency Location" }
      ]
    }
  },
  {
    path: "renew",
    component: SubscriptionPaidComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Organization Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "My Agency", url: "/home/orgprofile" },
        { title: "Renew Subscription" }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgProfileRoutingModule {}
