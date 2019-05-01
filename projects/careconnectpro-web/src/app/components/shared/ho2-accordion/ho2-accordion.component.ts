import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
  ElementRef,
  EventEmitter,
  Output
} from "@angular/core";
import { NgForOf } from "@angular/common";
import {
  AuthService,
  CareConnectLocalStorage,
  MediaService
} from "service-lib";
import { Router, NavigationExtras } from "@angular/router";
import { TaskList, WorkflowProcess } from "model-lib";

@Component({
  selector: "ho2-accordion",
  templateUrl: "./ho2-accordion.component.html"
})
export class Ho2AccordionComponent implements OnInit {
  @Input()
  titleClassName?: string = "";
  @Input()
  titleStyle?: string = "";
  @Input()
  bodyClassName?: string = "";
  @Input()
  bodyStyle?: string = "";
  @Input()
  titleName?: string = "";
  @Input()
  floatPosition?: string = "up";

  @Output()
  toggleSelected: EventEmitter<string> = new EventEmitter();

  @Input()
  @ContentChild("body")
  body: TemplateRef<ElementRef>;

  @Input()
  isCollapse?: boolean = false;

  constructor(
    public authService: AuthService,
    public localstore: CareConnectLocalStorage,
    private router: Router,
    private mediaSvc: MediaService
  ) {}

  ngOnInit() {
    this.validateInputs();
  }

  validateInputs() {
    switch (this.floatPosition) {
      case "up":
      case "down":
      case "left":
        break;
      default: {
        this.floatPosition = "up";
        break;
      }
    }
  }

  getTitleStyle(): string {
    let ret: string = "card-title ";
    switch (this.floatPosition) {
      case "left": {
        if (this.isCollapse === false) {
          ret += this.titleClassName;
        }
        break;
      }
      default: {
        ret += this.titleClassName;
        break;
      }
    }
    return ret;
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

  toggle() {
    this.isCollapse = !this.isCollapse;
    switch (this.floatPosition) {
      case "left":
        {
          if (this.isCollapse) {
            this.toggleSelected.emit("left-0");
          } else {
            this.toggleSelected.emit("left-1");
          }
        }
        break;
      case "up":
      case "down":
      default:
        if (this.isCollapse) {
          this.toggleSelected.emit("default-0");
        } else {
          this.toggleSelected.emit("default-1");
        }
        break;
    }
  }

  getCaretType(floatPos: number): string {
    switch (floatPos) {
      case 1: {
        if (this.isCollapse === false) {
          return "fa fa-caret-down";
        } else {
          return "fa fa-caret-left";
        }
      }
      case 0:
      default: {
        if (this.isCollapse === false) {
          return "fa fa-caret-down";
        } else {
          return "fa fa-caret-right";
        }
      }
    }
  }
}
