import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  Input,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { AuthService, VendorService } from "service-lib";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  EditHelperUserAction,
  EditHelperActionType,
  UserSession,
  AddressCodes
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "vendor-addstep2",
  templateUrl: "./vendor-addstep2.component.html"
})
export class OrgVendorAddStep2Component implements OnInit, OnChanges {
  usStateSelect: SelectItem[];
  activeVendorId: string;
  isLoading: boolean = false;
  errorMessage: string;
  activeCompanyId: string;
  states: any[];
  @Output() step2Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  isEditMode: boolean;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private vendorService: VendorService
  ) {}

  ngOnInit() {
    if (this.isNewRecord === null) {
      this.isNewRecord = false;
    }
    if (this.isNewRecord === true) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.states = AddressCodes.USStates;
    this.states = AddressCodes.USStates;
    this.populateStateDropDown();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.updateStatus === true) {
      this.isEditMode = false;
    }
  }

  editEventSubmit(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode = true;
        break;
      }
      case 4:
      case 2: {
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        this.vendorService.revertVendorData();
        this.cancelEditMode();
        break;
      }
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(["/home/personnel", "3"]);
  }

  submitForm() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step2Status.emit(userAction);
  }

  goToPrev() {
    this.goBack.emit(true);
  }

  populateStateDropDown() {
    let x: any = this.states;
    let y: any = x.sort(function(a: any, b: any) {
      return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
    });
    let z: any = y.map(function(usstate: any) {
      return {
        label: usstate.value,
        value: usstate.id
      };
    });
    this.usStateSelect = z;
  }
}
