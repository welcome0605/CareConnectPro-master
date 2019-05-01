import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { Observable, Observer } from "rxjs";
import { AppChatHeader, APIUrls } from "model-lib";

@Injectable({
  providedIn: "root"
})
export class SignalrhubService {
  private hubConnection: HubConnection;
  private hubConnBuilder: HubConnectionBuilder = new HubConnectionBuilder();
  private connMaxRetry: number = 3;
  private retryNum: number = 0;

  constructor() {}

  connectChatHub(): void {
    this.hubConnBuilder.withUrl(APIUrls.ChatHub);
    this.hubConnection = this.hubConnBuilder.build();
    this.hubConnection
      .start()
      .then(() => console.log("Connection started!"))
      .catch(err => {
        console.log(
          `Error while establishing connection - attempting another retry number ${
            this.retryNum
          }`
        );
        setTimeout(this.connectChatHub, 5000);
      });
  }

  listenChatMessages(userId: string): Observable<AppChatHeader> {
    const chatHub$ = new Observable<AppChatHeader>(Observer => {
      this.hubConnection.on(
        "ReceiveChatMessage",
        (receivedChat: AppChatHeader) => {
          if (receivedChat.chatUsers.includes(userId)) {
            Observer.next(receivedChat);
          }
        }
      );
    });
    return chatHub$;
  }

  sendChat(chatHeader: AppChatHeader) {
    this.hubConnection.invoke("SendMessage", chatHeader).catch(err => {
      console.error(err);
      if (this.retryNum < this.connMaxRetry) {
        console.log(
          `Error while establishing connection - attempting another retry number ${
            this.retryNum
          }`
        );
        this.retryNum++;
        this.connectChatHub();
      }
    });
  }
}
