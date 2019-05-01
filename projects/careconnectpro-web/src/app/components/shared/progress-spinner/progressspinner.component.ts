import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  QueryList
} from "@angular/core";
import { ProgressSpinnerService } from "service-lib";

@Component({
  selector: "progress-spinner",
  templateUrl: "./progressspinner.component.html",
  styleUrls: ["./progressspinner.component.css"]
})
export class ProgressSpinnerComponent {
  @ViewChild("btnShowSpinner") btnShowSpinner: ElementRef;
  @ViewChild("btnHideSpinner") btnHideSpinner: ElementRef;

  isSpinning: boolean;
  showSpinner: boolean = false;

  constructor(private spinnerService: ProgressSpinnerService) {
    this.isSpinning = false;
  }

  ngOnInit() {
    this.spinnerService.getSpinner().subscribe(e => {
      if (e.action === "show") {
        this.show();
      } else if (e.action === "hide") {
        this.hide();
      }
    });
  }

  show() {
    this.showSpinner = true;
  }

  hide() {
    this.showSpinner = false;
  }
}
