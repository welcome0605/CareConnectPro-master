import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserProfileRoutingModule } from "./profile.routing";
import { UserProfileSettingComponent } from "./settings/profilesetting.component";
import { UserProfileMainComponent } from "./main/profilemain.component";
import { UserProfileAlertComponent } from "./alerts/profilealert.component";
import { UserProfileComponent } from "./profile.component";
import { TableModule } from "primeng/components/table/table";
import { Ho2NgModule } from "../../../modules/app.module.ho2ng";

import {
  DataTableModule,
  SharedModule,
  DialogModule,
  RadioButtonModule,
  ToggleButtonModule,
  FileUploadModule,
  OverlayPanelModule,
  DropdownModule,
  CalendarModule,
  PasswordModule,
  KeyFilterModule,
  InputTextareaModule,
  ListboxModule,
  TabViewModule
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
    UserProfileRoutingModule,
    TabViewModule,
    DropdownModule,
    CalendarModule,
    PasswordModule,
    KeyFilterModule,
    ListboxModule,
    TableModule,
    InputTextareaModule,
    Ho2NgModule
  ],
  declarations: [
    UserProfileAlertComponent,
    UserProfileMainComponent,
    UserProfileSettingComponent,
    UserProfileComponent
  ]
})
export class UserProfileModule {}
