import { NgModule } from "@angular/core";
import {
  AuthService,
  AuthGuard,
  CanDeactivateGuard,
  AppHtmlControlService,
  BillingService,
  NotificationsService,
  AlertService,
  CareConnectLocalStorage,
  CompanyService,
  MediaService,
  SecurityService,
  EmployeeService,
  VendorService,
  PhysicianService,
  CodesService,
  PatientManagementService,
  IcdOasisService,
  PatientInTakeService,
  WorkflowMgtService
} from "service-lib";

@NgModule({
  providers: [
    AuthService,
    AuthGuard,
    AppHtmlControlService,
    BillingService,
    NotificationsService,
    AlertService,
    CareConnectLocalStorage,
    CompanyService,
    CanDeactivateGuard,
    MediaService,
    SecurityService,
    EmployeeService,
    CodesService,
    VendorService,
    PhysicianService,
    PatientManagementService,
    IcdOasisService,
    PatientInTakeService,
    WorkflowMgtService
  ]
})
export class AppServiceModule {}
