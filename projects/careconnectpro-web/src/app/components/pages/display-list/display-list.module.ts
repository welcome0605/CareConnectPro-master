// Modules
import { NgModule } from "@angular/core";
import { DisplayListComponent } from "./display-list.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [DisplayListComponent],
  imports: [RouterModule, CommonModule],
  exports: [DisplayListComponent],
  providers: []
})
export class DisplayListModule {}
