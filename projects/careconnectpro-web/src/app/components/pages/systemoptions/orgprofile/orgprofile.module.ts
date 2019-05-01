import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { OrgProfileRoutingModule } from "./orgprofile.routing";
import { SubscriptionPaidComponent } from "../../../../components/shared/subscription/subscription-paid.component";
import { OrgSubscriptionComponent } from "./subscriptionmain/subscriptionmain.component";
import { OrgSettingsComponent } from "./settings/orgsettings.component";
import { OrgMainComponent } from "./main/orgmain.component";
import { OrgMainAddressComponent } from "./main/orgmainaddress.component";
import { OrgMainDepartmentComponent } from "./main/orgmaindept.component";
import { TableModule } from "primeng/components/table/table";
import { Ho2NgModule } from "../../../../modules/app.module.ho2ng";

import {
  DataTableModule,
  SharedModule,
  DialogModule,
  RadioButtonModule,
  ToggleButtonModule,
  FileUploadModule,
  OverlayPanelModule,
  TabViewModule,
  AccordionModule
} from "primeng/primeng";

import { OrgProfileComponent } from "./orgprofile.component";

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
    OrgProfileRoutingModule,
    TabViewModule,
    TableModule,
    AccordionModule,
    Ho2NgModule
  ],
  declarations: [
    OrgProfileComponent,
    SubscriptionPaidComponent,
    OrgMainComponent,
    OrgSubscriptionComponent,
    OrgSettingsComponent,
    OrgMainDepartmentComponent,
    OrgMainAddressComponent
  ]
})
export class OrgProfileModule {}
