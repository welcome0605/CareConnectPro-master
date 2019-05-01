import { Component, OnInit, Input } from "@angular/core";
import {
  AuthService,
  CareConnectLocalStorage,
  MediaService
} from "service-lib";
import { Router, NavigationExtras } from "@angular/router";
import { TaskList } from "model-lib";

@Component({
  selector: "workflowmgt",
  templateUrl: "./workflowmgt.component.html"
})
export class WorkflowMgtComponent implements OnInit {
  @Input()
  taskList: TaskList[];

  constructor(
    public authService: AuthService,
    public localstore: CareConnectLocalStorage,
    private router: Router,
    private mediaSvc: MediaService
  ) {}

  ngOnInit() {
    if (!this.taskList && this.taskList === undefined) {
      this.taskList = [];
    }
  }

  getStatusFontStyle(stat: boolean): string {
    if (stat === false) {
      return "fa fa-times";
    } else {
      return "text-success fa fa-check";
    }
  }
  getStatusBgColor(stat: boolean): string {
    if (stat === true) {
      return "text-success";
    } else {
      return "";
    }
  }
}
