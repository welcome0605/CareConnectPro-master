import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SignupComponent } from "./signup.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Home",
      urls: [{ title: "Home", url: "/home" }, { title: "Signup Page" }]
    },
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule {}
