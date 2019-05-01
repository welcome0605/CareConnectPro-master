import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { ListingComponent } from "./listing/listing.component";
import { NewMessageComponent } from "./new-message/new-message.component";
import { DetailComponent } from "./detail/detail.component";
import { routes } from "./broadcast.routing";

@NgModule({
  declarations: [ListingComponent, NewMessageComponent, DetailComponent],
  imports: [routes, CommonModule, SharedModule],
  providers: [],
  bootstrap: [],
  exports: []
})
export class BroadcastModule {}
