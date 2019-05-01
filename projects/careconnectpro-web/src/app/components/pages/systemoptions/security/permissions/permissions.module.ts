import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrgPermissionsRoutingModule } from "./permissions.routing";
import {
  DataTableModule,
  SharedModule,
  DialogModule,
  RadioButtonModule,
  ToggleButtonModule,
  FileUploadModule,
  OverlayPanelModule
} from "primeng/primeng";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    RadioButtonModule,
    ToggleButtonModule,
    FileUploadModule,
    OverlayPanelModule,
    OrgPermissionsRoutingModule
  ],
  declarations: []
})
export class OrgPermissionsModule {}
