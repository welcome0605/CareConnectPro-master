import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { OrgRolesRoutingModule } from "./roles.routing";
import {
  DataTableModule,
  SharedModule,
  DialogModule,
  RadioButtonModule,
  ToggleButtonModule,
  FileUploadModule,
  OverlayPanelModule
} from "primeng/primeng";

//import { OrgRolesComponent } from './roles.component';

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
    OverlayPanelModule
    //OrgRolesComponent
  ],
  declarations: [
    //OrgRolesComponent
  ]
})
export class OrgRolesModule {}
