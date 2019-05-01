import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  AuthService,
  CareConnectLocalStorage,
  MediaService
} from "service-lib";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "ho2edithelper",
  templateUrl: "./ho2edithelper.component.html"
})
export class Ho2EditHelperComponent implements OnInit {
  @Output()
  actionSelected: EventEmitter<number> = new EventEmitter();

  @Input()
  activeAction: string;
  @Input()
  showDelete?: string;

  @Input()
  saveStatus: EventEmitter<boolean>;

  defaultAction: string;
  isConfirmDelete: boolean;

  constructor(
    public authService: AuthService,
    public localstore: CareConnectLocalStorage,
    private router: Router,
    private mediaSvc: MediaService
  ) {}

  ngOnInit() {
    this.isConfirmDelete = false;
    if (this.activeAction === null) {
      this.activeAction = "0";
    }

    if (this.showDelete === null) {
      this.showDelete = "false";
    }

    this.defaultAction = this.activeAction;

    if (this.saveStatus != null) {
      this.saveStatus.subscribe((event: boolean) => {
        if (event === false) {
          this.activeAction = this.defaultAction != "4" ? "1" : "4";
        } else {
          this.activeAction = this.defaultAction;
        }
      });
    }
  }

  confirmDelete(delRec: boolean) {
    if (delRec === true) {
      this.isConfirmDelete = false;
      this.toggleAction(5);
    } else {
      this.isConfirmDelete = false;
    }
  }

  displayDeletePrompt() {
    this.isConfirmDelete = true;
  }

  toggleAction(sel: number) {
    switch (sel) {
      case 1: {
        this.activeAction = "1";
        this.actionSelected.emit(1);
        break;
      }
      case 2: {
        this.activeAction = "0";
        this.actionSelected.emit(2);
        break;
      }
      case 3: {
        this.activeAction = "0";
        this.actionSelected.emit(3);
        break;
      }
      case 4: {
        this.activeAction = "4";
        this.actionSelected.emit(4);
        break;
      }
      case 5: {
        this.activeAction = "0";
        this.actionSelected.emit(5);
        break;
      }
    }
  }
}
