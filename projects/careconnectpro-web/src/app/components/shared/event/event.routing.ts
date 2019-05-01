import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "service-lib";
import { EventComponent } from "./components/event/event.component";

const EVENT_ROUTER: Routes = [
  {
    path: "personal",
    component: EventComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Personal calender",
      urls: [{ title: "Personal calender", url: "/calendar/personal" }],
      eventType: "personal"
    }
  },
  {
    path: "company",
    component: EventComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Company calender",
      urls: [{ title: "Company calender", url: "/calendar/company" }],
      eventType: "company"
    }
  }
];

export const routes = RouterModule.forChild(EVENT_ROUTER);
