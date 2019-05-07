import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PersonnelRoutingModule } from "./personnel.routing";
import { OrgVendorComponent } from "../personnel/vendors/vendors.component";
import { OrgPhysicianComponent } from "../personnel/physicians/physicians.component";
import { OrgEmployeesComponent } from "../personnel/employees/employees.component";
import { OrgEmployeeDetailComponent } from "../personnel/employees/detail/employee-detail.component";
import { OrgEmployeeAddStep1Component } from "../personnel/employees/addsteps/employee-addstep1.component";
import { OrgEmployeeAddStep2Component } from "../personnel/employees/addsteps/employee-addstep2.component";
import { OrgEmployeeAddStep4Component } from "../personnel/employees/addsteps/employee-addstep4.component";
import { OrgEmployeeAddStep3Component } from "../personnel/employees/addsteps/employee-addstep3.component";
import { OrgEmployeeAddMainComponent } from "../personnel/employees/addsteps/employee-addmain.component";
import { OrgPhysicianAddStep1Component } from "../personnel/physicians/addsteps/physician-addstep1.component";
import { OrgPhysicianAddStep2Component } from "../personnel/physicians/addsteps/physician-addstep2.component";
import { OrgPhysicianAddStep4Component } from "../personnel/physicians/addsteps/physician-addstep4.component";
import { OrgPhysicianAddStep3Component } from "../personnel/physicians/addsteps/physician-addstep3.component";
import { OrgPhysicianAddMainComponent } from "../personnel/physicians/addsteps/physician-addmain.component";
import { OrgVendorAddStep1Component } from "../personnel/vendors/addsteps/vendor-addstep1.component";
import { OrgVendorAddStep2Component } from "../personnel/vendors/addsteps/vendor-addstep2.component";
import { OrgVendorAddStep4Component } from "../personnel/vendors/addsteps/vendor-addstep4.component";
import { OrgVendorAddStep3Component } from "../personnel/vendors/addsteps/vendor-addstep3.component";
import { OrgVendorAddMainComponent } from "../personnel/vendors/addsteps/vendor-addmain.component";
import { OrgPhysicianDetailComponent } from "../personnel/physicians/detail/physician-detail.component";
import { OrgVendorDetailComponent } from "../personnel/vendors/detail/vendor-detail.component";
import { PersonnelComponent } from "./personnel.component";
import { TableModule } from "primeng/components/table/table";
import { Ho2NgModule } from "../../../../modules/app.module.ho2ng";
import { AppPrimeNGModule } from "../../../../modules/app.module.primeng";
import { Ng2SearchPipeModule } from "ng2-search-filter";

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
  ListboxModule
} from "primeng/primeng";

import { DisplayTileModule } from "../../display-tile/display-tile.module";
import { DisplayListModule } from "../../display-list/display-list.module";

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
    PersonnelRoutingModule,
    DropdownModule,
    CalendarModule,
    PasswordModule,
    KeyFilterModule,
    ListboxModule,
    TableModule,
    InputTextareaModule,
    Ho2NgModule,
    AppPrimeNGModule,
    DisplayTileModule,
    DisplayListModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    PersonnelComponent,
    OrgVendorComponent,
    OrgPhysicianComponent,
    OrgEmployeesComponent,
    OrgEmployeeDetailComponent,
    OrgEmployeeAddStep1Component,
    OrgEmployeeAddStep2Component,
    OrgEmployeeAddStep4Component,
    OrgEmployeeAddStep3Component,
    OrgEmployeeAddMainComponent,
    OrgPhysicianAddStep1Component,
    OrgPhysicianAddStep2Component,
    OrgPhysicianAddStep4Component,
    OrgPhysicianAddStep3Component,
    OrgPhysicianAddMainComponent,
    OrgVendorAddStep1Component,
    OrgVendorAddStep2Component,
    OrgVendorAddStep4Component,
    OrgVendorAddStep3Component,
    OrgVendorAddMainComponent,
    OrgPhysicianDetailComponent,
    OrgVendorDetailComponent
  ]
})
export class OrgPersonnelModule {}
