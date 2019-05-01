import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "service-lib";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Home",
      urls: [{ title: "Dashboard", url: "/" }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
