import { NgModule } from "@angular/core";
import { OrgPhysicianComponent } from "./physicians.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Personnel", url: "orgprofile" },
        { title: "Physicians" }
      ]
    },
    component: OrgPhysicianComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysiciansRoutingModule {}
