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
import {
  AuthService,
  CompanyService,
  ProgressSpinnerService,
  CodesService,
  PhysicianService,
  AlertService
} from "service-lib";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  EditHelperUserAction,
  EditHelperActionType,
  UserSession,
  Physician,
  GenderCode,
  SuffixCode,
  PrefixCode
} from "model-lib";
import "rxjs/add/operator/finally";
import { SelectItem } from "primeng/api";

@Component({
  selector: "physician-addstep1",
  templateUrl: "./physician-addstep1.component.html"
})
export class OrgPhysicianAddStep1Component implements OnInit, OnChanges {
  physicians: Physician[] = [];
  genderCodes: GenderCode[];
  genderCodesSelect: SelectItem[];
  suffixCodes: SuffixCode[];
  suffixCodesSelect: SelectItem[];
  prefixCodes: PrefixCode[];
  prefixCodesSelect: SelectItem[];
  activePhysicianId: string;
  isLoading: boolean = false;
  errorMessage: string;
  activeCompanyId: string;
  confirmDeActivate: boolean = false;
  confirmActivate: boolean = false;

  @Output() step1Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  isEditMode: boolean;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();

  imguser1: any;
  userSession: UserSession = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private physicianService: PhysicianService,
    private alertService: AlertService,
    private codesService: CodesService,
    private companyService: CompanyService,
    private spinnerService: ProgressSpinnerService
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
    this.getGenderCodes();
    this.getPrefixCodes();
    this.getSuffixCodes();
  }

  cancel() {
    this.router.navigate(["/home/personnel", "2"]);
  }

  editEventSubmit(event: any) {
    switch (event) {
      case 1: {
        //enable edit clicked
        this.isEditMode = true;
        break;
      }
      case 4: //update and save clicked
      case 2: {
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        //cancel clicked
        this.cancelEditMode();
        this.physicianService.revertPhysicianData();
        break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.updateStatus === true) {
      this.isEditMode = false;
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  public getGenderCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getGenderCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: GenderCode[] = data;
          this.genderCodes = ret;
          this.populateGenderDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read gender codes. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  public getPrefixCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getPrefixCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: PrefixCode[] = data;
          this.prefixCodes = ret;
          this.populatePrefixDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read prefix codes. Please contact Care Connect Pro service desk"
          );
        }
      );
  }

  public getSuffixCodes() {
    this.spinnerService.show();
    let ret = this.codesService
      .getSuffixCodes()
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: SuffixCode[] = data;
          this.suffixCodes = ret;
          this.populateSuffixDropDown();
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Unable to read suffix codes. Please contact Care Connect Pro service desk"
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  populateGenderDropDown() {
    let x: any = this.genderCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(gender: any) {
      return {
        label: gender.id,
        value: gender.id
      };
    });
    this.genderCodesSelect = z;
  }

  populatePrefixDropDown() {
    let x: any = this.prefixCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(prefix: any) {
      return {
        label: prefix.id,
        value: prefix.id
      };
    });
    this.prefixCodesSelect = z;
  }

  populateSuffixDropDown() {
    let x: any = this.suffixCodes;
    let y: any = x.sort(function(a: any, b: any) {
      return a.id > b.id ? 1 : b.id > a.id ? -1 : 0;
    });
    let z: any = y.map(function(suffix: any) {
      return {
        label: suffix.id,
        value: suffix.id
      };
    });
    this.suffixCodesSelect = z;
  }

  submitForm() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    }
    this.step1Status.emit(userAction);
  }

  deActivateUser() {
    const userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.delete,
      isSuccess: true
    };
    this.step1Status.emit(userAction);
    this.saveStatus.emit(true);
    this.cancelAction();
  }

  activateUser() {
    const userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.reActivate,
      isSuccess: true
    };
    this.step1Status.emit(userAction);
    this.saveStatus.emit(true);
    this.cancelAction();
  }

  confirmDelete() {
    this.confirmDeActivate = true;
  }

  confirmReActivation() {
    this.confirmActivate = true;
  }

  goToPrev() {
    this.goBack.emit(true);
  }

  cancelAction() {
    this.confirmActivate = false;
    this.confirmDeActivate = false;
  }
}
