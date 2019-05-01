import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../../../service-lib/src/lib/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "Care Connect Pro Software for Home HealthCare Agencies";

  constructor(private router: Router, public authService: AuthService) {
    this.title = "Care Connect Pro - Home Page";
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
