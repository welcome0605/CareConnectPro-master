import { NgModule } from "@angular/core";
import { PersonnelComponent } from "./personnel.component";
import { OrgEmployeesComponent } from "./employees/employees.component";
import { OrgPhysicianComponent } from "./physicians/physicians.component";
import { OrgVendorComponent } from "./vendors/vendors.component";
import { OrgEmployeeDetailComponent } from "./employees/detail/employee-detail.component";
import { OrgEmployeeAddMainComponent } from "./employees/addsteps/employee-addmain.component";
import { OrgPhysicianDetailComponent } from "./physicians/detail/physician-detail.component";
import { OrgPhysicianAddMainComponent } from "./physicians/addsteps/physician-addmain.component";
import { OrgVendorDetailComponent } from "./vendors/detail/vendor-detail.component";
import { OrgVendorAddMainComponent } from "./vendors/addsteps/vendor-addmain.component";
import { AuthGuard } from "service-lib";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel" }
      ]
    },
    component: PersonnelComponent
  },
  {
    path: ":ref",
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel" }
      ]
    },
    component: PersonnelComponent
  },
  {
    path: "employee",
    component: OrgEmployeesComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/1" },
        { title: "Manage Employees" }
      ]
    }
  },
  {
    path: "employee/add",
    component: OrgEmployeeAddMainComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/1" },
        { title: "Add New Employee" }
      ]
    }
  },
  {
    path: "employee/detail",
    component: OrgEmployeeDetailComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/1" },
        { title: "Employee Detail" }
      ]
    }
  },
  {
    path: "vendor",
    component: OrgVendorComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/3" },
        { title: "Manage Vendors" }
      ]
    }
  },
  {
    path: "vendor/add",
    component: OrgVendorAddMainComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/3" },
        { title: "Add New Vendor" }
      ]
    }
  },
  {
    path: "vendor/detail",
    component: OrgVendorDetailComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/3" },
        { title: "Vendor Detail" }
      ]
    }
  },
  {
    path: "physician",
    component: OrgPhysicianComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/2" },
        { title: "Manage Physician" }
      ]
    }
  },
  {
    path: "physician/add",
    component: OrgPhysicianAddMainComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/2" },
        { title: "Add New Physician" }
      ]
    }
  },
  {
    path: "physician/detail",
    component: OrgPhysicianDetailComponent,
    canActivate: [AuthGuard],
    data: {
      title: "System Options",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Personnel", url: "/home/personnel/2" },
        { title: "Physician Detail" }
      ]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelRoutingModule {}
