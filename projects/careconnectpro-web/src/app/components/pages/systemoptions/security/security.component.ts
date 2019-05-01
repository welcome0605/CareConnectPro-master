import { Component, ViewEncapsulation } from "@angular/core";
import { CareConnectLocalStorage } from "service-lib";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.css"]
})
export class OrgSecurityComponent {
  constructor(public localstore: CareConnectLocalStorage) {}
}
