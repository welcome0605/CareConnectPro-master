import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";
import { LoginRoutingModule } from "./login.routing";
import { ResetpwdComponent } from "./resetpwd/resetpwd.component";

@NgModule({
  imports: [FormsModule, CommonModule, LoginRoutingModule],
  declarations: [LoginComponent, ResetpwdComponent]
})
export class LoginModule {}
