import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/components/button/button";
import { GrowlModule } from "primeng/components/growl/growl";
import { ToastModule } from 'primeng/toast';

import { RadioButtonModule } from "primeng/components/radiobutton/radiobutton";
import {
  DataTableModule,
  SharedModule,
  DialogModule,
  ToggleButtonModule,
  OverlayPanelModule,
  DropdownModule,
  KeyFilterModule,
  PasswordModule,
  InputTextareaModule,
  TabViewModule,
  AccordionModule,
  SidebarModule,
  CheckboxModule
} from "primeng/primeng";
import { CalendarModule } from "primeng/calendar";
import { LightboxModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { ChipsModule } from "primeng/chips";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TooltipModule } from "primeng/tooltip";
import { MultiSelectModule } from "primeng/multiselect";

@NgModule({
  exports: [
    ButtonModule,
    GrowlModule,
    RadioButtonModule,
    DataTableModule,
    LightboxModule,
    SharedModule,
    DialogModule,
    ToggleButtonModule,
    OverlayPanelModule,
    DropdownModule,
    TableModule,
    KeyFilterModule,
    CalendarModule,
    PasswordModule,
    InputTextareaModule,
    TabViewModule,
    AccordionModule,
    SidebarModule,
    CheckboxModule,
    TableModule,
    ChipsModule,
    AutoCompleteModule,
    TooltipModule,
    MultiSelectModule,
    ToastModule
  ]
})
export class AppPrimeNGModule {}
