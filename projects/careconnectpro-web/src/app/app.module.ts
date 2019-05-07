import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./components/app/app.component";

//angular modules
import * as $ from "jquery";
import * as bootstrap from "bootstrap";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { AppServiceModule } from "./modules/app.module.service";
import { AppPrimeNGModule } from "./modules/app.module.primeng";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

//other modules
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CarouselModule } from "ngx-bootstrap/carousel";

//components sections
import { HomeComponent } from "./components/pages/home/home.component";
import { NavigationComponent } from "./components/shared/header-navigation/navigation.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { BreadcrumbComponent } from "./components/shared/breadcrumb/breadcrumb.component";
import { RightSidebarComponent } from "./components/shared/right-sidebar/rightsidebar.component";
import { NavMenuComponent } from "./components/pages/navmenu/navmenu.component";
import { NotificationsComponent } from "./components/shared/notification/notifications.component";
import { NotFoundComponent } from "./components/shared/notfound/notfound.component";
import { ProgressSpinnerComponent } from "./components/shared/progress-spinner/progressspinner.component";
import { DashboardModule } from "./components/pages/dashboard/dashboard.module";
import { LoginModule } from "./components/shared/login/login.module";
import { OrgProfileModule } from "./components/pages/systemoptions/orgprofile/orgprofile.module";
import { OrgSecurityModule } from "./components/pages/systemoptions/security/security.module";
import { OrgPersonnelModule } from "./components/pages/systemoptions/personnel/personnel.module";
import { UserProfileModule } from "./components/pages/userprofile/profile.module";
import { PatientMainModule } from "./components/pages/patient/patient-main.module";
import { EventModule } from "./components/shared/event/event.module";
import { SignupModule } from "./components/shared/signup/signup.module";
import { ModalComponent } from "./common/modal.component";

//services sections
import { AuthGuard, AppMessageService } from "service-lib";

//directives
import { EqualValidator } from "./directives/password.match.directive";
import { AlertComponent } from "./directives/alert-index";
import { MessageModule } from "./components/pages/message/message.module";
import { DatePipe } from "./pipes/DatePipe";
import { SharedModule } from "./components/shared/shared.module";
import { BroadcastModule } from "./components/pages/broadcast/broadcast.module";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home",
    component: HomeComponent, //canActivate: [AuthGuard],
    data: {
      title: "Home",
      urls: [{ title: "Dashboard", url: "/" }, { title: "Home" }]
    },
    children: [
      {
        path: "orgprofile",
        loadChildren: () => OrgProfileModule
      },
      {
        path: "dashboard",
        loadChildren: () => DashboardModule
      },
      {
        path: "security",
        loadChildren: () => OrgSecurityModule
      },
      {
        path: "personnel",
        loadChildren: () => OrgPersonnelModule
      },
      {
        path: "userprofile",
        loadChildren: () => UserProfileModule
      },
      {
        path: "patient",
        loadChildren: () => PatientMainModule
      },
      {
        path: "calendar",
        loadChildren: () => EventModule
      },
      {
        path: "message",
        loadChildren: () => MessageModule
      },
      {
        path: "broadcast",
        loadChildren: () => BroadcastModule
      }
    ]
  },
  { path: "login", loadChildren: () => LoginModule },
  {
    path: "signup",
    loadChildren: () => SignupModule
  },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    NavigationComponent,
    SidebarComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
    EqualValidator,
    NotificationsComponent,
    AlertComponent,
    ModalComponent,
    NotFoundComponent,
    ProgressSpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    AppPrimeNGModule,
    AppServiceModule,
    RouterModule.forRoot(routes, { enableTracing: true }),
    SharedModule
  ],
  providers: [AppMessageService],
  bootstrap: [AppComponent],
  exports: [EqualValidator]
})
export class AppModule {}
