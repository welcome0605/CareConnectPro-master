import { Component, OnInit } from "@angular/core";
import {
  UserLogin,
  UserSignup,
  SignupResponse,
  SubscriptionPkgDesc,
  SubscriptionPkgPrice,
  SubscriptionTypes,
  UserBillingInfo,
  UserPaymentInfo,
  AddressCodes,
  CreditCardCodes,
  CompanySubscription,
  UserSession
} from "model-lib";
import {
  AuthService,
  AppHtmlControlService,
  BillingService,
  NotificationsService,
  CareConnectLocalStorage,
  CompanyService,
  AlertService,
  ProgressSpinnerService
} from "service-lib";
import { Router } from "@angular/router";
import "rxjs/add/operator/finally";
import { BaseComponent } from "../core";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "subscription-paid",
  templateUrl: "./subscription-paid.component.html"
})
export class SubscriptionPaidComponent extends BaseComponent implements OnInit {
  signupmodel: UserSignup = {};
  paymodel: UserPaymentInfo = {};
  currMonth: any = new Date();
  nextMonth: any = new Date();
  subsmodel = this.companyService.subsmodel;
  subPkgPrice: SubscriptionPkgPrice[] = [];
  subPkgDesc: SubscriptionPkgDesc[] = [];
  subPkgType: SubscriptionTypes[];
  states: any[] = AddressCodes.USStates;
  countrycodes: any[] = AddressCodes.GlobalCountryCodes;
  ccardTypes: any[] = CreditCardCodes.CCardTypes;
  ccYears: any[] = CreditCardCodes.CCYears;
  loginRes: UserLogin = {};
  signupResp: SignupResponse = {};
  selectedSubPkg: SubscriptionPkgDesc = {};
  selectedSubText: string;
  step2title: string;
  steps: [string, number][] = [];

  showPage1: boolean = false;
  showPage2: boolean = false;
  showPage3: boolean = false;
  showPage4: boolean = false;
  form1Submitted: boolean = false;
  form2Submitted: boolean = false;
  form3Submitted: boolean = false;
  form4Submitted: boolean = false;
  isSubscribeTrial: boolean = false;
  isSubscribePaid: boolean = false;

  enableFormStep: boolean = true;
  enableFormSubTab: boolean = true;
  enableFormBillTab: boolean = false;
  enableFormPayTab: boolean = false;
  enableFormPayStatus: boolean = false;
  showProcessPayBtn: boolean = false;
  enablesubRemoval: boolean = true;

  isSubscribeFinished: boolean = false;

  currentSubStep: number = 1;
  userBilling: UserBillingInfo;
  cccardImg1 = require("../../../../assets/images/cc_front.png");
  cccardImg2 = require("../../../../assets/images/cc_back.png");
  userSession: UserSession;

  constructor(
    public authService: AuthService,
    public router: Router,
    public billingService: BillingService,
    private notificationsService: NotificationsService,
    public apphtmlcontrol: AppHtmlControlService,
    public localStore: CareConnectLocalStorage,
    private companyService: CompanyService,
    private alertService: AlertService,
    private spinnerService: ProgressSpinnerService
  ) {
    super();
  }

  ngOnInit() {
    this.initData();
    this.defineSteps();
    this.showPage1 = true;
    this.displayPage();
    this.selectedSubPkg = {};
    this.startPaidSub();
    this.getLoggedInUserInfo();
  }

  initComponentData() {
    this.companyService.subsmodel.companyId = this.userSession.companyId;
  }

  getLoggedInUserInfo() {
    this.authService.userSessionSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.userSession = data;
        this.initComponentData();
      });
  }
  initData() {
    this.paymodel.totamount = 0;
    this.paymodel.totmonths = 1;
  }

  defineSteps() {
    this.steps.push(["Select Package", 1]);
    this.steps.push(["Billing Information", 0]);
    this.steps.push(["Payment Method", 0]);
    this.steps.push(["Payment Status", 0]);
  }

  goBack() {
    if (this.currentSubStep > 1) {
      this.steps[this.currentSubStep - 1][1] = 0;
      this.currentSubStep = this.currentSubStep - 1;
      this.dspStep2Title(this.currentSubStep);
      this.steps[this.currentSubStep - 1][1] = 1;
    }
  }

  submitStep1() {
    this.dspStep2Title(2);
    this.currentSubStep = 2;
    this.steps[0][1] = 2;
    this.steps[1][1] = 1;
    this.calTotalAmount();
  }

  submitStep2() {
    this.dspStep2Title(3);
    this.currentSubStep = 3;
    this.steps[1][1] = 2;
    this.steps[2][1] = 1;
  }

  submitStep3() {
    this.dspStep2Title(4);
    this.steps[2][1] = 2;
    this.steps[3][1] = 2;
  }

  submitStep4() {
    this.router.navigate(["/home/orgprofile"]);
  }

  getCompanySubscriptions() {
    this.spinnerService.show();
    let cmpid: any = this.subsmodel.companyId;
    let ret = this.companyService
      .getCompanySubscriptionById(cmpid)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        (data: any) => {
          let ret: any = data;
          this.companyService.companySubscriptions = ret;
        },
        (error: any) => {
          this.alertService.clear();
          this.alertService.error(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );
  }

  submitCreditPayment() {
    this.paymodel = this.billingService.processPayment(this.paymodel);

    const pkgIdx: number = this.subPkgDesc.findIndex(
      pkg => pkg.pkgPriceId === this.selectedSubPkg.id
    );
    if (pkgIdx > -1) {
      this.companyService.subsmodel.packageId = this.subPkgDesc[
        pkgIdx
      ].description;
    }
    this.currMonth = new Date();
    this.nextMonth = new Date();
    let x: number = +this.paymodel.totmonths;
    this.nextMonth.setMonth(this.nextMonth.getMonth() + x);
    this.companyService.subsmodel.id = this.selectedSubText;
    this.companyService.subsmodel.startDate = this.currMonth;
    this.companyService.subsmodel.endDate = this.nextMonth;
    this.companyService.subsmodel.isActive = true;
    this.companyService.subsmodel.totalAmount = this.paymodel.totamount;

    this.spinnerService.show();
    let ret = this.companyService
      .addSubscription(this.subsmodel)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          let ret: CompanySubscription = data;
          this.companyService.activeSubscription = ret;
          this.companyService.subsmodel.id = ret.id;
          this.getCompanySubscriptions();
          this.submitStep3();
        },
        error => {
          this.alertService.clear();
          this.alertService.error(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
          console.log(
            "Renew subscription failed. Please contact Care Connect Pro service desk."
          );
        }
      );

    this.selectedSubText = this.billingService.getSubscriptionTypeById(12);
    this.enableFormPayStatus = true;
    this.enableFormStep = true;
    this.notificationsService.notify(
      "success",
      "Credit Card Transaction",
      "$" + this.paymodel.totamount + " payment approved!"
    );
    this.dspStep2Title(4);
    this.currentSubStep = 4;
    this.enablelinkSubStep(4);
    this.enablesubRemoval = false;
    this.enableFormPayTab = false;
    this.enableFormBillTab = false;
    this.enableFormSubTab = false;
    this.isSubscribeFinished = true;
  }

  calTotalAmount() {
    let x = this.billingService.getPkgPrice(this.selectedSubPkg.id);
    this.paymodel.totamount = this.paymodel.totmonths * x;
  }

  enablelinkSubStep(stepnum: number) {
    $(function() {
      $("#subtab1").removeClass("active");
      $("#subtab2").removeClass("active");
      $("#subtab3").removeClass("active");
      $("#subtab4").removeClass("active");
    });

    switch (stepnum) {
      case 1: {
        $(function() {
          $("#subtab1").addClass("active");
        });
        break;
      }
      case 2: {
        $(function() {
          $("#subtab2").addClass("active");
        });
        break;
      }
      case 3: {
        $(function() {
          $("#subtab3").addClass("active");
        });
        break;
      }
      case 4: {
        $(function() {
          $("#subtab4").addClass("active");
        });
        break;
      }
    }
  }

  validateSubForm() {
    switch (this.currentSubStep) {
      case 1: {
        if (this.selectedSubPkg.id != 0) {
          this.enableFormBillTab = true;
          this.notificationsService.notify(
            "success",
            "Subscription",
            this.selectedSubPkg.description + " package selected!"
          );
          this.dspStep2Title(2);
          this.currentSubStep = 2;
          this.enablelinkSubStep(2);
        } else {
          this.enableFormBillTab = false;
        }
        break;
      }

      case 2: {
        let isInvalid: boolean = false;
        if (this.userBilling.firstname == "") {
          isInvalid = true;
        }
        if (this.userBilling.lastname == "") {
          isInvalid = true;
        }
        if (this.userBilling.address1 == "") {
          isInvalid = true;
        }
        if (this.userBilling.city == "") {
          isInvalid = true;
        }
        if (this.userBilling.state == "") {
          isInvalid = true;
        }
        if (this.userBilling.zipCode == "") {
          isInvalid = true;
        }

        if (!isInvalid) {
          this.enableFormPayTab = true;
          this.notificationsService.notify(
            "success",
            "Subscription",
            "Billing information completed!"
          );
          this.dspStep2Title(3);
          this.currentSubStep = 3;
          this.enablelinkSubStep(3);
        } else {
          this.enableFormPayTab = false;
        }
        break;
      }

      case 3: {
        let isInvalid: boolean = false;

        if (this.paymodel.cardnumber == null) {
          isInvalid = true;
        }
        if (this.paymodel.cardtype == null) {
          isInvalid = true;
        }
        if (this.paymodel.totmonths == 0) {
          isInvalid = true;
        }

        if (!isInvalid) {
          this.showProcessPayBtn = true;
        } else {
          this.showProcessPayBtn = false;
        }
        break;
      }

      case 4: {
        break;
      }
    }
  }

  dspStep2Title(step: number) {
    this.currentSubStep = step;
    switch (step) {
      case 1: {
        this.step2title = "Choose a subscription package (Step 1 of 4)";

        break;
      }
      case 2: {
        this.step2title =
          "Enter your credit card billing information (Step 2 of 4)";
        break;
      }
      case 3: {
        this.step2title = "Enter your credit card details (Step 3 of 4)";
        break;
      }
      case 4: {
        this.step2title =
          "Please review the payment status below (Step 4 of 4)";
        break;
      }
    }
  }

  onPaymentStoreCard(option: boolean) {
    this.paymodel.storecard = option;
    this.validateSubForm();
  }

  showSubscribeMain() {
    this.isSubscribeTrial = false;
    this.isSubscribePaid = false;
    this.enableFormStep = true;
    this.paymodel = {};
    this.userBilling = {};
    this.notificationsService.notify(
      "success",
      "Subscription",
      "Removed subscription package!"
    );
    this.isSubscribeFinished = false;
  }

  registerUser() {
    this.spinnerService.show();
    var ret = this.authService
      .registerCompany(this.signupmodel)
      .finally(() => {
        this.spinnerService.hide();
      })
      .subscribe(
        data => {
          this.signupResp = data;
          this.showPage1 = false;
          this.showPage2 = false;
          this.showPage3 = false;
          this.showPage4 = true;
          this.displayPage();
          this.notificationsService.notify(
            "success",
            "Login Information",
            "Account created successfully!"
          );
        },
        error => {
          this.signupResp = error;
          console.log(this.signupResp.message);
          this.notificationsService.notify(
            "error",
            "Client Registration",
            "Unable to create account, please contact the Care Connect Pro Service Desk."
          );
        }
      );
  }

  startPaidSub() {
    this.isSubscribePaid = true;
    this.isSubscribeTrial = false;
    this.subsmodel.packageId = "";
    this.subPkgPrice = this.billingService.getSubscriptionPkgPrice();
    this.subPkgDesc = this.billingService.getSubscriptionPkgDesc();
    this.subPkgType = this.billingService.getSubscriptionTypes();

    this.dspStep2Title(1);
    this.enableFormStep = false;
    this.enableFormSubTab = true;
    this.enableFormBillTab = false;
    this.enableFormPayTab = false;
    this.enableFormPayStatus = false;
  }

  displayPage() {
    if (this.showPage1) {
      $(function() {
        $("#stepsDiv1").show();
        $("#liStep1").removeClass();
        $("#liStep2").removeClass();
        $("#liStep3").removeClass();
        $("#liStep4").removeClass();
        $("#liStep1").addClass("first current");
        $("#liStep1").attr("aria-disabled", "false");
        $("#liStep1").attr("aria-selected", "true");
        $("#liStep2").addClass("disabled");
        $("#liStep2").attr("aria-disabled", "true");
        $("#liStep2").attr("aria-selected", "false");
        $("#liStep3").addClass("disabled");
        $("#liStep3").attr("aria-disabled", "true");
        $("#liStep3").attr("aria-selected", "false");
        $("#liStep4").addClass("disabled last");
        $("#liStep4").attr("aria-disabled", "true");
        $("#liStep4").attr("aria-selected", "false");
      });
    } else {
      $(function() {
        $("#stepsDiv1").hide();
      });
    }

    if (this.showPage2) {
      $(function() {
        $("#stepsDiv2").show();
        $("#liStep1").removeClass();
        $("#liStep2").removeClass();
        $("#liStep3").removeClass();
        $("#liStep4").removeClass();
        $("#liStep1").addClass("first done");
        $("#liStep1").attr("aria-disabled", "false");
        $("#liStep1").attr("aria-selected", "false");
        $("#liStep2").addClass("current");
        $("#liStep2").attr("aria-disabled", "false");
        $("#liStep2").attr("aria-selected", "true");
        $("#liStep3").addClass("disabled");
        $("#liStep3").attr("aria-disabled", "true");
        $("#liStep3").attr("aria-selected", "false");
        $("#liStep4").addClass("disabled last");
        $("#liStep4").attr("aria-disabled", "true");
        $("#liStep4").attr("aria-selected", "false");
      });
    } else {
      $(function() {
        $("#stepsDiv2").hide();
      });
    }

    if (this.showPage3) {
      $(function() {
        $("#stepsDiv3").show();
        $("#liStep1").removeClass();
        $("#liStep2").removeClass();
        $("#liStep3").removeClass();
        $("#liStep4").removeClass();
        $("#liStep1").addClass("first done");
        $("#liStep1").attr("aria-disabled", "false");
        $("#liStep1").attr("aria-selected", "false");
        $("#liStep2").addClass("done");
        $("#liStep2").attr("aria-disabled", "false");
        $("#liStep2").attr("aria-selected", "false");
        $("#liStep3").addClass("current");
        $("#liStep3").attr("aria-disabled", "false");
        $("#liStep3").attr("aria-selected", "true");
        $("#liStep4").addClass("disabled last");
        $("#liStep4").attr("aria-disabled", "true");
        $("#liStep4").attr("aria-selected", "false");
      });
    } else {
      $(function() {
        $("#stepsDiv3").hide();
      });
    }

    if (this.showPage4) {
      $(function() {
        $("#stepsDiv4").show();
        $("#liStep1").removeClass();
        $("#liStep2").removeClass();
        $("#liStep3").removeClass();
        $("#liStep4").removeClass();
        $("#liStep1").addClass("first done");
        $("#liStep1").attr("aria-disabled", "false");
        $("#liStep1").attr("aria-selected", "false");
        $("#liStep2").addClass("done");
        $("#liStep2").attr("aria-disabled", "false");
        $("#liStep2").attr("aria-selected", "false");
        $("#liStep3").addClass("done");
        $("#liStep3").attr("aria-disabled", "false");
        $("#liStep3").attr("aria-selected", "false");
        $("#liStep4").addClass("last current");
        $("#liStep4").attr("aria-disabled", "false");
        $("#liStep4").attr("aria-selected", "true");
      });
    } else {
      $(function() {
        $("#stepsDiv4").hide();
      });
    }
  }

  ShowPage(page: number) {
    if (this.signupmodel.firstname == "") {
      console.log("First name is required");
    }
    if (this.signupmodel.lastname == "") {
      console.log("last name is required");
    }

    switch (page) {
      case 0: {
        this.showPage1 = true;
        this.showPage2 = false;
        this.showPage3 = false;
        this.showPage4 = false;
        break;
      }
      case 1: {
        this.showPage1 = true;
        this.showPage2 = false;
        this.showPage3 = false;
        this.showPage4 = false;
        break;
      }
      case 2: {
        if (this.currentSubStep == 1 && !this.isSubscribeFinished) {
          this.notificationsService.notify(
            "success",
            "Personal and Company Information",
            "Successfully Completed!"
          );
        }
        this.showPage1 = false;
        this.showPage2 = true;
        this.showPage3 = false;
        this.showPage4 = false;
        break;
      }
      case 3: {
        this.showPage1 = false;
        this.showPage2 = false;
        this.showPage3 = true;
        this.showPage4 = false;
        break;
      }
      case 4: {
        this.registerUser();
        break;
      }
      case 99: {
        this.showPage1 = false;
        this.showPage2 = false;
        this.showPage3 = false;
        this.showPage4 = true;
        break;
      }
    }
    this.displayPage();
  }
}
