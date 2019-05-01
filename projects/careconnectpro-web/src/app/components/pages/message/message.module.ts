import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { routes } from "./message.routing";
import { DetailComponent } from "./components/detail/detail.component";
import { ListingComponent } from "./components/listing/listing.component";
import { NewMessageComponent } from "./components/new-message/new-message.component";
import { SharedModule } from "../../shared/shared.module";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { DEFAULT_DROPZONE_CONFIG } from "../../../app.config";
import { ChatComponent } from "./components/chat/chat.component";
import { FilterPipe } from "../../../pipes/FilterPipe";

import { TableModule } from "primeng/table";
import { ChipsModule } from "primeng/chips";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TooltipModule } from "primeng/tooltip";
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
  declarations: [
    DetailComponent,
    ListingComponent,
    NewMessageComponent,
    ChatComponent,
    FilterPipe
  ],
  imports: [
    routes,
    CommonModule,
    SharedModule,
    DropzoneModule,
    TableModule,
    ChipsModule,
    AutoCompleteModule,
    TooltipModule,
    MultiSelectModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  bootstrap: [],
  exports: []
})
export class MessageModule {}
