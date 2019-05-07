import { Component, OnInit, OnDestroy } from "@angular/core";
import { Message } from "primeng/primeng";
import {MessageService} from 'primeng/api';
import { NotificationsService } from "service-lib";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
  providers: [MessageService]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  msgs: Message[] = [];
  subscription: Subscription;

  constructor(
    private notificationsService: NotificationsService,
    private messageService: MessageService
    ) {}

  ngOnInit() {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.subscription = this.notificationsService.notificationChange.subscribe(
      notification => {
        this.messageService.add(notification);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
