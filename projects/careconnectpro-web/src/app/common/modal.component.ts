import { Component } from "@angular/core";

@Component({
  selector: "app-modal",
  template: `
    <div
      (click)="onContainerClicked($event)"
      class="modal fade"
      tabindex="-1"
      [ngClass]="{ in: visibleAnimate }"
      [ngStyle]="{
        display: visible ? 'block' : 'none',
        opacity: visibleAnimate ? 1 : 0
      }"
    >
      <div class="modal-dialog" style="padding-top: 20em;">
        <div class="modal-content">
          <div class="modal-body" style="padding:0em;height:42.95px;">
            <ng-content select=".app-modal-body"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal {
        background: rgba(0, 0, 0, 0.6);
      }
    `
  ]
})
export class ModalComponent {
  public visible = false;
  public visibleAnimate = false;

  constructor() {}

  public show(): void {
    this.visible = true;
    setTimeout(() => (this.visibleAnimate = true), 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => (this.visible = false), 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains("modal")) {
      this.hide();
    }
  }
}
