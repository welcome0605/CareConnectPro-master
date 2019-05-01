import { NgModule } from "@angular/core";
import { PatientMainComponent } from "./patient-main.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "service-lib";
import { PatientInTakeComponent } from "./patient-intake/patient-intake.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";

const routes: Routes = [
  {
    path: "",
    component: PatientMainComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Patient Management",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Patient Management" }
      ]
    }
  },
  {
    path: "intake",
    component: PatientInTakeComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Patient InTake",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Patient Management", url: "/home/patient" },
        { title: "Patient Intake" }
      ]
    }
  },
  {
    path: "detail",
    component: PatientDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Patient Details",
      urls: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Patient Management", url: "/home/patient" },
        { title: "Patient Detail" }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientMainRoutingModule {}
