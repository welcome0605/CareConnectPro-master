import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { PhysiciansRoutingModule } from "./physicians.routing";
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

//import { PhysiciansComponent } from './physicians.component';

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
  declarations: [
    //PhysiciansComponent
  ]
})
export class OrgphysiciansModule {}
