import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { CalendarModule } from "primeng/calendar";
import { ScheduleModule } from "primeng/schedule";

import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard.routing";
import { SharedModule } from "../../shared/shared.module";
import { TabsModule } from "ngx-bootstrap";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    CalendarModule,
    ScheduleModule,
    DashboardRoutingModule,
    SharedModule,
    TabsModule.forRoot(),
    NgbTabsetModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
