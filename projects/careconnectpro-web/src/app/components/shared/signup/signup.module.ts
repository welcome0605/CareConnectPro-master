import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SignupComponent } from "./signup.component";
import { SignupRoutingModule } from "./signup.routing";

@NgModule({
  imports: [FormsModule, CommonModule, SignupRoutingModule],
  declarations: [SignupComponent]
})
export class SignupModule {}
