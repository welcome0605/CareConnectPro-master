import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  DataTableModule,
  SharedModule,
  DialogModule,
  RadioButtonModule,
  ToggleButtonModule,
  FileUploadModule,
  OverlayPanelModule,
  DropdownModule
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
    DropdownModule
  ],
  declarations: []
})
export class OrgEmployeesModule {}
