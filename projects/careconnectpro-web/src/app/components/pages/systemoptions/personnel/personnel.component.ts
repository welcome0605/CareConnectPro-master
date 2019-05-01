import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { CareConnectLocalStorage } from "service-lib";
import { ActivatedRoute } from "@angular/router";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-personnel",
  templateUrl: "./personnel.component.html",
  styleUrls: ["./personnel.component.css"]
})
export class PersonnelComponent implements OnInit {
  tabView: number = 1;
  tabRef: any;

  constructor(
    private localstore: CareConnectLocalStorage,
    private activeRoute: ActivatedRoute
  ) {
    this.tabView = 1;
  }

  public ShowEmployeeTab() {
    this.tabView = 1;
  }

  ngOnInit() {
    this.parseUrlQuery();
  }

  public ShowPhysicianTab() {
    this.tabView = 2;
  }

  public ShowVendorTab() {
    this.tabView = 3;
  }

  public getActiveTabClass(tabNum: number) {
    if (tabNum === this.tabView) {
      return "nav-link active";
    } else {
      return "nav-link";
    }
  }

  parseUrlQuery() {
    this.activeRoute.params.subscribe(parms => {
      this.tabRef = parms["ref"];
      if (this.tabRef != null && this.tabRef != undefined) {
        switch (this.tabRef) {
          case "1": {
            this.tabView = 1;
            break;
          }
          case "2": {
            this.tabView = 2;
            break;
          }
          case "3": {
            this.tabView = 3;
            break;
          }
          default: {
            this.tabView = 1;
            break;
          }
        }
      }
    });
  }
}
