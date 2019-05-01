import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
  ElementRef,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { NgForOf } from "@angular/common";
import {
  AuthService,
  CareConnectLocalStorage,
  MediaService
} from "service-lib";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "ho2-stepper",
  templateUrl: "./ho2-stepper.component.html"
})
export class Ho2StepperComponent implements OnInit, OnChanges {
  @Input()
  steps?: [string, number][];

  @Output()
  stepSelected: EventEmitter<string> = new EventEmitter();

  @Input()
  @ContentChild("body")
  body: TemplateRef<ElementRef>;

  constructor(
    public authService: AuthService,
    public localstore: CareConnectLocalStorage,
    private router: Router,
    private mediaSvc: MediaService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const x: any = this.steps;
    //const y: any = changes.steps;
  }

  getHeaderClass(step: number): string {
    let status: number = 0;
    if (this.steps !== undefined) {
      status = this.steps[step][1];
    }

    switch (status) {
      case 0: {
        return "app-ho2-stepper-header-pending";
      }
      case 1: {
        return "app-ho2-stepper-header-edit";
      }
      case 2: {
        return "app-ho2-stepper-header-done";
      }
      default: {
        return "app-ho2-stepper-header-pending";
      }
    }
  }

  getStepIconClass(step: number): string {
    let status: number = 0;
    if (this.steps !== undefined) {
      status = this.steps[step][1];
    }

    switch (status) {
      case 0: {
        return "fa fa-pause-circle";
      }
      case 1: {
        return "fa fa-edit";
      }
      case 2: {
        return "fa fa-check-circle";
      }
      default: {
        return "fa fa-pause-circle";
      }
    }
  }
}
