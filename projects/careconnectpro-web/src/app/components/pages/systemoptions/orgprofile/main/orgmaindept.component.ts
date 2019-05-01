import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  EventEmitter
} from "@angular/core";
import {
  CompanyService,
  NotificationsService,
  CareConnectLocalStorage,
  ProgressSpinnerService,
  AlertService,
  AuthService
} from "service-lib";
import { Company, Department, UserSession } from "model-lib";
import "rxjs/add/operator/finally";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-orgmaindept",
  templateUrl: "./orgmaindept.component.html"
})
export class OrgMainDepartmentComponent implements OnInit {
  title: string;
  subtitle: string;
  isLoading: boolean = false;
  isNonGridLoading: boolean = false;
  companyInfo: Company = {};
  rootNode: any;
  isEditMode: boolean;
  activeCompanyId: string;
  displayDialogDept: boolean;
  department: Department = {};
  selectedDepartment: Department = {};
  newDept: boolean;
  companyDepartments: Department[];
  isNewDept: boolean = false;
  id: any;
  errorMessage: string;
  @ViewChild("f3") f3: NgForm;
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  userSession: UserSession = {};

  constructor(
    public companyService: CompanyService,
    private notifyservice: NotificationsService,
    public localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.title = "Agency Department";
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.isEditMode = false;
    this.isNonGridLoading = false;
    this.isLoading = false;
    this.parseUrlQuery();
    this.getDeptInfo();
  }

  parseUrlQuery() {
    this.activeRoute.params.subscribe(parms => {
      this.id = parms["id"];
      this.updateView();
    });
  }

  updateView() {
    if (this.id === undefined || this.id === "") {
      this.newDept = true;
      this.isEditMode = true;
    } else {
      this.department.id = this.id;
      this.newDept = false;
    }
  }

  isDeptNameExist(): boolean {
    if (this.isNewDept === true) {
      let idx: number = this.companyDepartments.findIndex(
        dept => dept.name === this.department.name
      );
      if (idx > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getDeptInfo() {
    this.getCompanyDepartments();
  }

  getTitle(): string {
    if (this.department.id != null && this.department.id !== "") {
      this.isNewDept = false;
      return "Edit Agency Department";
    } else {
      this.isNewDept = true;
      return "Add New Agency Department";
    }
  }

  updateAgencyInfo(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode = true;
        break;
      }
      case 4:
      case 2: {
        if (!this.isDeptNameExist()) {
          this.f3.ngSubmit.emit();
          if (this.f3.form.valid === false) {
            this.saveStatus2.emit(false);
            this.isEditMode = true;
          }
        }
        break;
      }
      case 3: {
        this.cancelEditMode();
        this.getDeptInfo();
        break;
      }
      case 5: {
        this.deleteDept();
        this.routeToMain();
        break;
      }
    }
  }

  saveUpdateDept() {
    this.saveStatus2.emit(true);
    this.saveDept();
    this.routeToMain();
  }

  routeToMain() {
    this.router.navigate(["/home/orgprofile"]);
  }

  showSpinner() {
    this.spinnerService.show();
  }

  getCompanyDepartments() {
    this.spinnerService.show();
    let ret = this.companyService
      .getCompanyDepartmentById(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let x: Department[] = data;
          if (x.length > 0) {
            this.companyDepartments = x;
            const idx: number = this.companyDepartments.findIndex(
              item => item.id === this.id
            );
            if (idx > -1) {
              this.department = this.companyDepartments[idx];
            }
          }
        },
        (error: any) => {
          console.log(
            "OrgProfile Init - Error retrieving your company information. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  saveDept() {
    let departments: Department[] = [];
    if (
      this.companyDepartments != undefined ||
      this.companyDepartments != null
    ) {
      departments = [...this.companyDepartments];
    }

    if (this.newDept) {
      this.spinnerService.show();
      this.department.companyId = this.activeCompanyId;
      let ret = this.companyService
        .addDepartment(this.department)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let ret: Department = data;
            departments.push(ret);
            this.saveDepartmentUpdateDT(departments);
          },
          error => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );
    } else {
      this.spinnerService.show();
      let ret = this.companyService
        .updateDepartment(this.department)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let x: any = data;
            this.saveDepartmentUpdateDT(departments);
          },
          error => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            console.log(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );

      departments[this.findSelectedDeptIndex()] = this.department;
    }
  }

  saveDepartmentUpdateDT(_departments: Department[]) {
    this.companyDepartments = _departments;
    this.department = {};
    this.displayDialogDept = false;

    if (this.newDept) {
      this.notifyservice.notify(
        "success",
        "Update Company",
        "Department added successfully"
      );
    } else {
      this.notifyservice.notify(
        "success",
        "Update Company",
        "Department updated successfully"
      );
    }
    this.companyService.isCompanyRecordChanged.emit(true);
  }

  deleteDept() {
    let index = this.findSelectedDeptIndex();
    this.companyDepartments = this.companyDepartments.filter(
      (val, i) => i != index
    );
    this.spinnerService.show();
    let ret = this.companyService
      .deleteDepartment(this.department)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Department = data;
          this.department = {};
          this.displayDialogDept = false;
          this.notifyservice.notify(
            "success",
            "Update Company",
            "Department deleted successfully"
          );
          this.companyService.isCompanyRecordChanged.emit(true);
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Update failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  findSelectedDeptIndex(): number {
    return this.companyDepartments.indexOf(this.selectedDepartment);
  }
}
