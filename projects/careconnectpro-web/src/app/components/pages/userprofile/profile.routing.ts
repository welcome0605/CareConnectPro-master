import { NgModule } from "@angular/core";
import { UserProfileComponent } from "./profile.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Profile",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "User Profile" }
      ]
    },
    component: UserProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule {}
