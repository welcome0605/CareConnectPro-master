import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  EventEmitter
} from "@angular/core";
import {
  CompanyService,
  NotificationsService,
  ProgressSpinnerService,
  AlertService,
  CareConnectLocalStorage,
  AuthService
} from "service-lib";
import {
  Company,
  Address,
  Department,
  UserLogin,
  UserSession,
  APIUrls
} from "model-lib";
import "rxjs/add/operator/finally";
import { Router, ActivatedRoute } from "@angular/router";
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
  selector: "app-orgmainaddress",
  templateUrl: "./orgmainaddress.component.html"
})
export class OrgMainAddressComponent extends BaseComponent implements OnInit {
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
  selectedMainLoc: number;
  id: string;
  errorMessage: string;
  @ViewChild("f2") f2: NgForm;
  saveStatus2: EventEmitter<boolean> = new EventEmitter();
  userSession: UserSession;

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
    super();
    this.title = "Agency Address";
  }

  ngOnInit() {
    this.userSession = this.authService.getUserLoggedIn();
    this.activeCompanyId = this.userSession.companyId;
    this.isEditMode = false;
    this.isNonGridLoading = false;
    this.isLoading = false;
    this.parseUrlQuery();
    this.getAddressInfo();
  }

  parseUrlQuery() {
    this.activeRoute.params.subscribe(parms => {
      this.id = parms["id"];
      this.updateView();
    });
  }

  updateView() {
    if (this.id === undefined || this.id === "") {
      this.newAddress = true;
      this.isEditMode = true;
    } else {
      this.companyAddress.id = this.id;
      this.newAddress = false;
    }
  }

  getAddressInfo() {
    this.getCompanyAddress();
  }

  getTitle(): string {
    if (this.companyAddress.id != null && this.companyAddress.id !== "") {
      this.isNewAddress = false;
      return "Edit Agency Address";
    } else {
      this.isNewAddress = true;
      return "Add New Agency Address";
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
        this.f2.ngSubmit.emit();
        if (this.f2.form.valid === false) {
          this.saveStatus2.emit(false);
          this.isEditMode = true;
        }
        break;
      }
      case 3: {
        this.cancelEditMode();
        this.getAddressInfo();
        break;
      }
      case 5: {
        this.deleteAddress();
        this.routeToMain();
        break;
      }
    }
  }

  saveUpdateAddress() {
    this.saveStatus2.emit(true);
    this.saveAddress();
    this.routeToMain();
  }

  routeToMain() {
    this.router.navigate(["/home/orgprofile"]);
  }

  showSpinner() {
    this.spinnerService.show();
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
            const idx: number = this.companyAddresses.findIndex(
              item => item.id === this.id
            );
            if (idx > -1) {
              this.companyAddress = this.companyAddresses[idx];
            }
            if (this.companyAddress.isPrimary) {
              this.selectedMainLoc = 1;
            } else {
              this.selectedMainLoc = 0;
            }
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

  saveAddress() {
    let companyAddresses: Address[] = [];
    if (this.companyAddresses != undefined || this.companyAddresses != null) {
      companyAddresses = [...this.companyAddresses];
    }

    if (this.newAddress) {
      this.spinnerService.show();
      this.companyAddress.id = this.activeCompanyId;
      let ret = this.companyService
        .addAddress(this.companyAddress)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let ret: Address = data;
            companyAddresses.push(ret);
            this.saveAddressUpdateDT(companyAddresses);
          },
          error => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            this.logConsoleText(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );
    } else {
      this.spinnerService.show();
      let ret = this.companyService
        .updateAddress(this.companyAddress)
        .finally(() => {
          this.spinnerService.hide();
        })
        .subscribe(
          data => {
            let x: any = data;
            this.saveAddressUpdateDT(companyAddresses);
          },
          error => {
            this.alertService.clear();
            this.alertService.error(
              "Update failed. Please contact Care Connect Pro service desk."
            );
            this.logConsoleText(
              "OrgProfile - Update failed. Please contact Care Connect Pro service desk."
            );
          }
        );

      companyAddresses[this.findSelectedAddressIndex()] = this.companyAddress;
    }
  }

  saveAddressUpdateDT(_companyAddresses: Address[]) {
    this.companyAddresses = _companyAddresses;
    this.companyAddress = {};
    this.displayDialogAddress = false;

    if (this.isNewAddress) {
      this.notifyservice.notify(
        "success",
        "Update Agency",
        "Address added successfully"
      );
    } else {
      this.notifyservice.notify(
        "success",
        "Update Agency",
        "Address updated successfully"
      );
    }
    this.companyService.isCompanyRecordChanged.emit(true);
  }

  deleteAddress() {
    let index = this.findSelectedAddressIndex();
    this.companyAddresses = this.companyAddresses.filter(
      (val, i) => i != index
    );
    this.spinnerService.show();
    let ret = this.companyService
      .deleteAddress(this.companyAddress)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: Address = data;
          this.companyAddress = {};
          this.displayDialogAddress = false;
          this.notifyservice.notify(
            "success",
            "Update Agency",
            "Address deleted successfully"
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

  findSelectedAddressIndex(): number {
    return this.companyAddresses.indexOf(this.selectedAddress);
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
