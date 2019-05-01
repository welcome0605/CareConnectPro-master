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
  NotificationsService,
  AlertService,
  ProgressSpinnerService,
  PhysicianService
} from "service-lib";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import {
  EditHelperUserAction,
  EditHelperActionType,
  UserSession,
  PhysicianPracticeArea
} from "model-lib";
import "rxjs/add/operator/finally";

@Component({
  selector: "physician-addstep3",
  templateUrl: "./physician-addstep3.component.html"
})
export class OrgPhysicianAddStep3Component implements OnInit, OnChanges {
  activePhysicianId: string;
  isLoading: boolean = false;
  errorMessage: string;
  activeCompanyId: string;
  isNewPractice: boolean = true;
  disableAddPracticeBtn: boolean = true;
  disableDeletePracticeBtn: boolean = true;
  selectedPhysicianPractice: string;
  tempPractice: string;

  @Output() step3Status: EventEmitter<EditHelperUserAction> = new EventEmitter<
    EditHelperUserAction
  >();
  @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isNewRecord?: boolean;
  @Input() updateStatus?: boolean;
  isEditMode: boolean;
  @ViewChild("f2") f2: NgForm;
  saveStatus: EventEmitter<boolean> = new EventEmitter();

  imguser1: any;
  userSession: UserSession;

  constructor(
    public authService: AuthService,
    public router: Router,
    private notifyService: NotificationsService,
    private physicianService: PhysicianService,
    private alertService: AlertService,
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
    this.getPhysicianPractices();
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
        this.cancelEditMode();
        this.physicianService.revertPhysicianData();
        break;
      }
    }
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(["/home/personnel", "2"]);
  }

  private onPracticeSelect() {
    this.tempPractice = this.selectedPhysicianPractice;
    this.isNewPractice = false;
    this.disableDeletePracticeBtn = false;
    this.disableAddPracticeBtn = false;
  }

  submitForm() {
    let userAction: EditHelperUserAction = {
      actionType: EditHelperActionType.add,
      isSuccess: true
    };
    if (this.isNewRecord === false) {
      userAction.actionType = EditHelperActionType.update;
    } else {
      this.getPhysicianPracticeForDbOper();
    }
    this.step3Status.emit(userAction);
  }

  goToPrev() {
    this.goBack.emit(true);
  }

  private validatePracticeInputText(event: any) {
    let x: any = event.target.value;
    //block the ability to add ore delete based on if the practice is null
    if (x == "") {
      switch (this.isNewPractice) {
        case true: {
          this.disableAddPracticeBtn = true;
          break;
        }
        case false: {
          this.disableDeletePracticeBtn = true;
          this.isNewPractice = true;
          break;
        }
      }
    } else {
      switch (this.isNewPractice) {
        case true: {
          this.disableAddPracticeBtn = false;
          break;
        }
      }
    }
  }

  deletePracticeFromDb() {
    if (this.isNewRecord) {
      this.deletePracticeFromListNoDb();
    } else {
      let practice: PhysicianPracticeArea = {};
      let x: any = this.physicianService.physician.practices.find(
        (x: any) => x.practiceCodeId == this.selectedPhysicianPractice
      );
      if (x != undefined) {
        practice = x;
      }
      let ret = this.physicianService
        .deletePhysicianPracticeArea(practice)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: any = data;
            this.getPracticeFromDb();
            this.notifyService.notify(
              "success",
              "Update Physician",
              "Practice deleted successfully"
            );
            this.spinnerService.hide();
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "create physician failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "create physician failed. Please contact Care Connect Pro service desk."
            );
            this.spinnerService.hide();
          }
        );
    }
  }

  //function to delete practice from list without calling Db
  private deletePracticeFromListNoDb() {
    let x: number;
    x = this.physicianService.physicianPracticesSelect.findIndex(
      x => x.label == this.tempPractice
    );
    this.physicianService.physicianPracticesSelect.splice(x, 1);
    this.clearTempPracticeText();

    this.notifyService.notify(
      "success",
      "Update Physician",
      "Practice deleted successfully"
    );
  }

  private clearTempPracticeText() {
    this.tempPractice = "";
    this.disableAddPracticeBtn = true;
    this.disableDeletePracticeBtn = true;
    this.isNewPractice = true;
  }

  private getPracticeFromDb() {
    if (!this.isNewRecord) {
      this.spinnerService.show();
      let ret = this.physicianService
        .getPhysicianArea(this.physicianService.physician.id)
        .finally((data: any) => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: PhysicianPracticeArea[] = data;
            this.physicianService.physician.practices = [];
            this.physicianService.physician.practices = ret;
            this.populatePhysicianPractice();
            this.spinnerService.hide();
          },
          (error: any) => {
            this.spinnerService.hide();
            this.alertService.clear();
            this.alertService.error(
              "Unable to read physician practices. Please contact Care Connect Pro service desk"
            );
          }
        );
    }
  }

  private savePractice() {
    if (this.isValidPracticeName()) {
      if (this.isNewRecord) {
        this.addToPracticeList(this.tempPractice);
      } else {
        if (this.isNewPractice) {
          this.addPracticeFromDb();
        } else {
          this.updatePracticeFromDb();
        }
      }
    } else {
      this.alertService.clear();
      this.alertService.error(
        "Practice name already exist in list. Please enter a different name."
      );
    }
  }

  private addPracticeFromDb() {
    if (!this.isNewPractice) {
      this.updatePracticeFromDb();
    } else {
      let practice: PhysicianPracticeArea;
      practice.practiceCodeId = this.tempPractice;
      practice.physicianId = this.physicianService.physician.id;
      let ret = this.physicianService
        .addPhysicianPracticeArea(practice)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: any = data;
            this.getPracticeFromDb();
            this.notifyService.notify(
              "success",
              "Update Physician",
              "Practice updated successfully"
            );
            this.spinnerService.hide();
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "create physician failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "create physician failed. Please contact Care Connect Pro service desk."
            );
            this.spinnerService.hide();
          }
        );
    }
  }

  private updatePracticeFromDb() {
    if (this.isNewRecord) {
      this.updatePracticeListNoDb();
    } else {
      let practice: PhysicianPracticeArea;
      let x = this.physicianService.physician.practices.find(
        (x: any) => x.practiceCodeId == this.selectedPhysicianPractice
      );
      if (x != undefined) {
        practice = x;
      }

      practice.practiceCodeId = this.tempPractice;
      let ret = this.physicianService
        .updatePhysicianPracticeArea(practice)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let ret: any = data;
            this.getPracticeFromDb();
            this.notifyService.notify(
              "success",
              "Update Physician",
              "Practice updated successfully"
            );
            this.spinnerService.hide();
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "create physician failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "create physician failed. Please contact Care Connect Pro service desk."
            );
            this.spinnerService.hide();
          }
        );
    }
  }

  private updatePracticeListNoDb() {
    let x: number = this.physicianService.physicianPracticesSelect.findIndex(
      x => x.label == this.selectedPhysicianPractice
    );
    if (x == 0 || x > 0) {
      this.physicianService.physicianPracticesSelect[
        x
      ].label = this.tempPractice;
      this.physicianService.physicianPracticesSelect[
        x
      ].value = this.tempPractice;
    }

    this.notifyService.notify(
      "success",
      "Update Physician",
      "Practice updated successfully"
    );
  }

  private getPhysicianPracticeForDbOper() {
    let practices: PhysicianPracticeArea[] = [];
    this.physicianService.physicianPracticesSelect.forEach(item => {
      let x: PhysicianPracticeArea;
      x.practiceCodeId = item.value;
      x.physicianId = this.physicianService.physician.id;
      practices.push(x);
    });
    this.physicianService.physician.practices = practices;
  }

  private addToPracticeList(practice: string) {
    if (!this.physicianService.physicianPracticesSelect) {
      this.physicianService.physicianPracticesSelect = [];
    }
    this.physicianService.physicianPracticesSelect.push({
      value: practice,
      label: practice
    });
    this.clearTempPracticeText();

    if (this.isNewPractice) {
      this.notifyService.notify(
        "success",
        "Update Physician",
        "Practice added successfully"
      );
    } else {
      this.notifyService.notify(
        "success",
        "Update Physician",
        "Practice updated successfully"
      );
    }
  }

  private isValidPracticeName(): boolean {
    let ret: boolean = false;
    if (!this.isNewRecord) {
      if (!this.physicianService.physician.practices) {
        this.physicianService.physician.practices = [];
      }
      let y: any = this.physicianService.physician.practices.find(
        (x: any) => x.practiceCodeId == this.tempPractice
      );
      if (y != undefined) {
        ret = false;
      } else {
        ret = true;
      }
    } else {
      if (!this.physicianService.physicianPracticesSelect) {
        this.physicianService.physicianPracticesSelect = [];
      }
      let x: any = this.physicianService.physicianPracticesSelect.find(
        x => x.label == this.tempPractice
      );
      if (x != undefined) {
        ret = false;
      } else {
        ret = true;
      }
    }
    return ret;
  }

  private populatePhysicianPractice() {
    this.isNewPractice = true;
    if (this.physicianService.physician.practices) {
      this.physicianService.physicianPracticesSelect = [];
      this.physicianService.physician.practices.forEach(practice => {
        if (practice.practiceCodeId) {
          this.physicianService.physicianPracticesSelect.push({
            label: practice.practiceCodeId,
            value: practice.practiceCodeId
          });
        }
      });
    }
  }

  private getPhysicianPractices() {
    let ret = this.physicianService
      .getPhysicianArea(this.physicianService.physician.id)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          if (data != null) {
            this.physicianService.physician.practices = data;
            this.populatePhysicianPractice();
          }
          this.spinnerService.hide();
        },
        (error: any) => {
          console.log(
            "physician detail - unable to retrieve physician practice area. Please contact Care Connect Pro service desk."
          );
          this.spinnerService.hide();
        }
      );
  }
}
