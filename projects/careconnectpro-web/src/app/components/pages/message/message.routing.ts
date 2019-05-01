import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "service-lib";
import { ListingComponent } from "./components/listing/listing.component";
import { DetailComponent } from "./components/detail/detail.component";
import { NewMessageComponent } from "./components/new-message/new-message.component";
import { ChatComponent } from "./components/chat/chat.component";

const MESSAGE_ROUTER: Routes = [
  {
    path: "mail/:mailbox",
    component: ListingComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Messages",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Inbox" }
      ],
      typeMessage: "draft"
    }
  },
  {
    path: "view/:mailbox/:id",
    component: DetailComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Detail",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "View message", url: "/message/:mailbox/:id" }
      ]
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
        { title: "New message", url: "/message/new/:id" }
      ],
      responseType: "new"
    }
  },
  {
    path: "forward/:id",
    component: NewMessageComponent,
    canActivate: [AuthGuard],
    data: {
      title: "New message",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Forward message", url: "/message/forward/:id" }
      ],
      responseType: "forward"
    }
  },
  {
    path: "reply/:id",
    component: NewMessageComponent,
    canActivate: [AuthGuard],
    data: {
      title: "New message",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Reply message", url: "/message/reply/:id" }
      ],
      responseType: "reply"
    }
  },
  {
    path: "chat/:id",
    component: ChatComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Chat",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Chat", url: "/message/chat" }
      ]
    }
  },
  {
    path: "chat",
    component: ChatComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Chat",
      urls: [
        { title: "Dashboard", url: "/home/dashboard" },
        { title: "Chat", url: "/message/chat" }
      ]
    }
  }
];

export const routes = RouterModule.forChild(MESSAGE_ROUTER);
