import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs/Subject";
import { Router, NavigationStart } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ProgressSpinnerService {
  private subject = new Subject<any>();
  private message: string = "";

  getSpinner(): Observable<any> {
    return this.subject.asObservable();
  }

  show() {
    this.subject.next({ action: "show" });
  }

  hide() {
    this.subject.next({ action: "hide" });
  }

  setMessage(msg: string) {
    this.message = msg;
  }
}
