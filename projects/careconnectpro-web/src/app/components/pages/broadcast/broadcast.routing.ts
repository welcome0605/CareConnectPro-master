import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "service-lib";
import { ListingComponent } from "./listing/listing.component";
import { NewMessageComponent } from "./new-message/new-message.component";
import { DetailComponent } from "./detail/detail.component";

const BROADCAST_ROUTER: Routes = [
  {
    path: "",
    component: ListingComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Broadcast",
      urls: [{ title: "Broadcast", url: "/message/broadcast" }],
      typeMessage: "broadcast"
    }
  },
  {
    path: "new",
    component: NewMessageComponent,
    canActivate: [AuthGuard],
    data: {
      title: "New message",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "System Broadcast", url: "/home/broadcast" },
        { title: "New Message", url: "/broadcast/new" }
      ]
    }
  },
  {
    path: "detail/:id",
    component: DetailComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Detail",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "System Broadcast", url: "/home/broadcast" },
        { title: "Detail", url: "/message/broadcast/detail/:id" }
      ]
    }
  }
];

export const routes = RouterModule.forChild(BROADCAST_ROUTER);
