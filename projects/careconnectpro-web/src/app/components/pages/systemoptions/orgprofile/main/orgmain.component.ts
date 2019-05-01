import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  ViewChild
} from "@angular/core";
import {
  CompanyService,
  NotificationsService,
  CareConnectLocalStorage,
  ProgressSpinnerService,
  AlertService,
  AuthService
} from "service-lib";
import {
  Company,
  Address,
  Department,
  APIUrls,
  UserLogin,
  UserSession
} from "model-lib";
import "rxjs/add/operator/finally";
import { Router } from "@angular/router";
import {
  NG_VALIDATORS,
  Validator,
  Validators,
  AbstractControl,
  ValidatorFn,
  NgForm
} from "@angular/forms";
import { BaseComponent } from "../../../../shared/core/base.component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-orgmain",
  templateUrl: "./orgmain.component.html"
})
export class OrgMainComponent extends BaseComponent implements OnInit {
  title: string;
  subtitle: string;
  isLoading: boolean = false;
  isNonGridLoading: boolean = false;
  companyInfo: Company;
  rootNode: any;
  isEditMode: boolean;
  activeCompanyId: string;
  displayDialogAddress: boolean;
  companyAddress: Address;
  selectedAddress: Address;
  newAddress: boolean;
  companyAddresses: Address[];
  isNewAddress: boolean = false;
  sortF: any;
  sortO: any;
  sortO2: any;
  changeSort: any;
  displayDialogDept: boolean;
  department: Department;
  selectedDepartment: Department;
  newDept: boolean;
  companyDepartments: Department[];
  isNewDept: boolean = false;
  sortF2: any;
  selectedMainLoc: number;
  stacked: boolean = false;
  @ViewChild("f1") f1: NgForm;
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  userSession: UserSession;
  errorMessage: string;

  constructor(
    public companyService: CompanyService,
    private notifyservice: NotificationsService,
    public localstore: CareConnectLocalStorage,
    private spinnerService: ProgressSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
    this.title = "Organization Profile";
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.GetContactsPage();
    this.isEditMode = false;
    this.isNonGridLoading = false;
    this.isLoading = false;
    this.companyService.isCompanyRecordChanged.subscribe((event: boolean) => {
      if (event === true) {
        this.GetContactsPage();
      }
    });
  }

  //get data for contacts page
  GetContactsPage() {
    this.getCompanyInfo();
    this.getCompanyAddress();
    this.getCompanyDepartments();
  }

  updateAgencyInfo(event: any) {
    switch (event) {
      case 1: {
        this.isEditMode = true;
        break;
      }
      case 4:
      case 2: {
        this.f1.ngSubmit.emit();
        if (this.f1.form.valid === false) {
          this.saveStatus2.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode();
        this.getCompanyInfo();
        break;
      }
    }
  }

  saveUpdateCompany() {
    this.saveStatus2.emit(true);
    this.updateCompany();
  }

  routeAddLocation() {
    this.router.navigate([
      "/home/orgprofile/loc",
      this.companyAddress.id ? this.companyAddress.id : ""
    ]);
  }

  routeAddDept() {
    this.router.navigate([
      "/home/orgprofile/dept",
      this.department.id ? this.department.id : ""
    ]);
  }

  showSpinner() {
    this.spinnerService.show();
  }

  getCompanyInfo() {
    this.spinnerService.show();
    let ret = this.companyService
      .getCompanyById(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          this.companyInfo = data;
          console.log(data);
          console.log(this.companyInfo);
        },
        (error: any) => {
          this.logConsoleText(
            "OrgProfile Init - Error retrieving your company information. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  getCompanyAddress() {
    this.spinnerService.show();
    let ret = this.companyService
      .getCompanyAddressById(this.activeCompanyId)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let x: Address[] = data;
          if (x.length > 0) {
            this.companyAddresses = x;
          }
        },
        (error: any) => {
          this.logConsoleText(
            "OrgProfile Init - Error retrieving your company information. Please contact Care Connect Pro service desk."
          );
        }
      );
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
          }
        },
        (error: any) => {
          this.logConsoleText(
            "OrgProfile Init - Error retrieving your company information. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  cancelEditMode() {
    this.isEditMode = false;
  }

  updateCompany() {
    if (!this.isEditMode) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
      this.spinnerService.show();
      let ret = this.companyService
        .updateCompanyInfo(this.companyInfo)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          (data: any) => {
            let x: any = data;
            if (x) {
              this.notifyservice.notify(
                "success",
                "Company Information",
                "Updated Successfully"
              );
            }
          },
          (error: any) => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            this.logConsoleText(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );
    }
  }

  changeSortAddress(event: any) {
    if (!event.order) {
      this.sortF = "city";
    } else {
      this.sortF = event.field;
    }
  }

  showAddressDialogToAdd() {
    this.isNewAddress = true;
    this.newAddress = true;
    this.companyAddress = {};
    this.displayDialogAddress = true;
  }

  onRowSelectAddress(event: any) {
    this.isNewAddress = false;
    this.newAddress = false;
    this.companyAddress = this.cloneAddress(event.data);
    if (this.companyAddress.isPrimary) {
      this.selectedMainLoc = 1;
    } else {
      this.selectedMainLoc = 0;
    }
    this.displayDialogAddress = true;
    this.routeAddLocation();
  }

  cloneAddress(a: Address): Address {
    let address: any;
    let y: any = a;
    for (let prop in a) {
      address[prop] = y[prop];
    }
    return address;
  }

  findSelectedAddressIndex(): number {
    return this.companyAddresses.indexOf(this.selectedAddress);
  }

  changeSortDept(event: any) {
    if (!event.order) {
      this.sortF2 = "name";
    } else {
      this.sortF2 = event.field;
    }
  }

  showDeptDialogToAdd() {
    this.isNewDept = true;
    this.newDept = true;
    this.department = {};
    this.displayDialogDept = true;
  }

  onRowSelectDept(event: any) {
    this.isNewDept = false;
    this.newDept = false;
    this.department = this.cloneDept(event.data);
    this.displayDialogDept = true;
    this.routeAddDept();
  }

  cloneDept(a: Department): Department {
    let Dept: any;
    let y: any = a;
    for (let prop in a) {
      Dept[prop] = y[prop];
    }
    return Dept;
  }

  findSelectedDeptIndex(): number {
    return this.companyDepartments.indexOf(this.selectedDepartment);
  }

  setMainLocation(sel: number) {
    if (sel == 0) {
      this.selectedMainLoc = 0;
      if (this.companyAddress != undefined || this.companyAddress != null) {
        this.companyAddress.isPrimary = false;
      }
    } else {
      this.selectedMainLoc = 1;
      if (this.companyAddress != undefined || this.companyAddress != null) {
        this.companyAddress.isPrimary = true;
      }
    }
  }
}
