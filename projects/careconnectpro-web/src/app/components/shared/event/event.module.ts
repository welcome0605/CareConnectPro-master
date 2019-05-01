import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { routes } from "./event.routing";
import { SharedModule } from "../shared.module";

@NgModule({
  declarations: [],
  imports: [routes, CommonModule, SharedModule],
  providers: [],
  bootstrap: [],
  exports: []
})
export class EventModule {}
