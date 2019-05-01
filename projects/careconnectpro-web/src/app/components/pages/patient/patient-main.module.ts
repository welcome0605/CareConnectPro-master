import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PatientMainRoutingModule } from "./patient-main.routing";
import { PatientMainComponent } from "./patient-main.component";
import { PatientSearchComponent } from "./patient-search/patient-search.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { PatientInTakeComponent } from "./patient-intake/patient-intake.component";
import { PatientInTakeStep1Component } from "./patient-intake/workflow/patient-intake-step1.component";
import { PatientInTakeStep2Component } from "./patient-intake/workflow/patient-intake-step2.component";
import { PatientInTakeStep3Component } from "./patient-intake/workflow/patient-intake-step3.component";
import { PatientInTakeStep4Component } from "./patient-intake/workflow/patient-intake-step4.component";
import { PatientInTakeStep5Component } from "./patient-intake/workflow/patient-intake-step5.component";
import { PatientInTakeStep6Component } from "./patient-intake/workflow/patient-intake-step6.component";
import { PatientInTakeStep7Component } from "./patient-intake/workflow/patient-intake-step7.component";
import { PatientInTakeStep8Component } from "./patient-intake/workflow/patient-intake-step8.component";
import { PatientInTakeStep9Component } from "./patient-intake/workflow/patient-intake-step9.component";
import { PatientInTakeStep9Sub1Component } from "./patient-intake/workflow/patient-intake-step9sub1.component";
import { PatientInTakeStep9Sub2Component } from "./patient-intake/workflow/patient-intake-step9sub2.component";
import { Ho2NgModule } from "../../../modules/app.module.ho2ng";
import { TableModule } from "primeng/components/table/table";

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
  CheckboxModule
} from "primeng/primeng";
import { DisplayListModule } from "../display-list/display-list.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";

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
    DropdownModule,
    CalendarModule,
    PasswordModule,
    KeyFilterModule,
    ListboxModule,
    TableModule,
    CheckboxModule,
    InputTextareaModule,
    Ho2NgModule,
    PatientMainRoutingModule,
    DisplayListModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    PatientMainComponent,
    PatientSearchComponent,
    PatientInTakeComponent,
    PatientDetailsComponent,
    PatientInTakeStep1Component,
    PatientInTakeStep2Component,
    PatientInTakeStep3Component,
    PatientInTakeStep4Component,
    PatientInTakeStep5Component,
    PatientInTakeStep6Component,
    PatientInTakeStep7Component,
    PatientInTakeStep8Component,
    PatientInTakeStep9Component,
    PatientInTakeStep9Sub1Component,
    PatientInTakeStep9Sub2Component
  ]
})
export class PatientMainModule {}
