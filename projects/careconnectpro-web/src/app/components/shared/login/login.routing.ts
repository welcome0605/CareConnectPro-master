import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component";
import { ResetpwdComponent } from "./resetpwd/resetpwd.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Home",
      urls: [{ title: "Home", url: "/home" }, { title: "Login Page" }]
    },
    component: LoginComponent
  },
  {
    path: "resetpwd/:token",
    component: ResetpwdComponent,
    data: {
      title: "Home",
      urls: [{ title: "Home", url: "/home" }, { title: "Reset Password" }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
