import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Home",
      urls: [{ title: "Dashboard", url: "/dashboard" }]
    },
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
