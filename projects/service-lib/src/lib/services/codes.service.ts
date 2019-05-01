import { Injectable, OnInit } from "@angular/core";
import {
  PatientRelationshipType,
  InsuranceNetworkStatus,
  MaritalStatus,
  RaceType,
  APIUrls,
  GenderCode,
  PrefixCode,
  SalaryCode,
  SuffixCode,
  ServiceCode,
  PracticeCode,
  HealthConditionType,
  IcdSearchType
} from "model-lib";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { SelectItem } from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class CodesService implements OnInit {
  private _genderCode: GenderCode;
  private _suffixCode: SuffixCode;
  private _prefixCode: PrefixCode;
  private _salaryCode: SalaryCode;
  private _serviceCodes: ServiceCode[];
  private _practiceCodes: PracticeCode[];
  private maritalCodesSelect: SelectItem[];
  private raceCodesSelect: SelectItem[];
  private genderCodesSelect: SelectItem[];
  private suffixCodesSelect: SelectItem[];
  private prefixCodesSelect: SelectItem[];
  private relationshipCodesSelect: SelectItem[];
  private networkStatusSelect: SelectItem[];
  private healthConditionsSelect: SelectItem[];
  private icdSearchTypeSelect: SelectItem[];

  constructor(private httpc: HttpClient) {
    this.initCodes();
  }

  /**
   * Method - Life cycle hook - init service
   */
  ngOnInit() {}

  /**
   * Method - Return list of suffix types select items
   */
  getGenderCodesSelect(): SelectItem[] {
    return this.genderCodesSelect;
  }

  /**
   * Method - Return list of race codes select items
   */
  getRaceCodesSelect(): SelectItem[] {
    return this.raceCodesSelect;
  }

  /**
   * Method - Return list of race codes select items
   */
  getMaritalCodesSelect(): SelectItem[] {
    return this.maritalCodesSelect;
  }

  /**
   * Method - Return list of suffix types select items
   */
  getSuffixCodesSelect(): SelectItem[] {
    return this.suffixCodesSelect;
  }

  /**
   * Method - Return list of prefix types select items
   */
  getPrefixCodesSelect(): SelectItem[] {
    return this.prefixCodesSelect;
  }

  /**
   * Method - Return list of relationship types select items
   */
  getRelationshipCodesSelect(): SelectItem[] {
    return this.relationshipCodesSelect;
  }

  /**
   * Method - Return list of Health conditions select items
   */
  getHealthConditionsSelect(): SelectItem[] {
    return this.healthConditionsSelect;
  }

  /**
   * Method - Return list of ICD Search Type status select items
   */
  getIcdSearchTypeSelect(): SelectItem[] {
    return this.icdSearchTypeSelect;
  }

  /**
   * Method - Return list of network status select items
   */
  getNetworkStatusSelect(): SelectItem[] {
    return this.networkStatusSelect;
  }

  getGenderCodes(): any {
    return this.httpc.get(APIUrls.CodesGetGenderCodes).pipe(
      map((ret: any) => {
        this._genderCode = ret;
        return this._genderCode;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  initCodes() {
    this.maritalCodesSelect = [];
    this.maritalCodesSelect.push({
      label: "Married",
      value: MaritalStatus.married
    });
    this.maritalCodesSelect.push({
      label: "Widowed",
      value: MaritalStatus.widowed
    });
    this.maritalCodesSelect.push({
      label: "Separated",
      value: MaritalStatus.separated
    });
    this.maritalCodesSelect.push({
      label: "Divorced",
      value: MaritalStatus.divorced
    });
    this.maritalCodesSelect.push({
      label: "Single",
      value: MaritalStatus.single
    });

    this.raceCodesSelect = [];
    this.raceCodesSelect.push({
      label: "American Indian Or Alaska Native",
      value: RaceType.AmericanIndianOrAlaskaNative
    });
    this.raceCodesSelect.push({ label: "Asian", value: RaceType.Asian });
    this.raceCodesSelect.push({
      label: "Black Or African American",
      value: RaceType.BlackOrAfricanAmerican
    });
    this.raceCodesSelect.push({
      label: "Native Hawaiian Or Other Pacific Islander",
      value: RaceType.NativeHawaiianOrOtherPacificIslander
    });
    this.raceCodesSelect.push({ label: "White", value: RaceType.White });

    this.relationshipCodesSelect = [];
    this.relationshipCodesSelect.push({
      label: "Self",
      value: PatientRelationshipType.self
    });
    this.relationshipCodesSelect.push({
      label: "Spouse",
      value: PatientRelationshipType.spouse
    });
    this.relationshipCodesSelect.push({
      label: "Mother",
      value: PatientRelationshipType.mother
    });
    this.relationshipCodesSelect.push({
      label: "Father",
      value: PatientRelationshipType.father
    });

    this.networkStatusSelect = [];
    this.networkStatusSelect.push({
      label: "In Network",
      value: InsuranceNetworkStatus.inNetwork
    });
    this.networkStatusSelect.push({
      label: "Out of Network",
      value: InsuranceNetworkStatus.outOfNetwork
    });

    this.healthConditionsSelect = [];
    this.healthConditionsSelect.push({
      label: "All",
      value: HealthConditionType.All
    });
    this.healthConditionsSelect.push({
      label: "Medication Allergies",
      value: HealthConditionType.Allergy
    });
    this.healthConditionsSelect.push({
      label: "Health Conditions",
      value: HealthConditionType.SeriousAilment
    });

    this.icdSearchTypeSelect = [];
    this.icdSearchTypeSelect.push({
      label: "Name or Description",
      value: IcdSearchType.Description
    });
    this.icdSearchTypeSelect.push({
      label: "ICD Code",
      value: IcdSearchType.Icd
    });
  }

  getPrefixCodes(): any {
    return this.httpc.get(APIUrls.CodesGetPrefixCodes).pipe(
      map((ret: any) => {
        this._prefixCode = ret;
        return this._prefixCode;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getSuffixCodes(): any {
    return this.httpc.get(APIUrls.CodesGetSuffixCodes).pipe(
      map((ret: any) => {
        this._suffixCode = ret;
        return this._suffixCode;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getSalaryCodes(): any {
    return this.httpc.get(APIUrls.CodesGetSalaryCodes).pipe(
      map((ret: any) => {
        this._salaryCode = ret;
        return this._salaryCode;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getServiceCodes(): any {
    return this.httpc.get(APIUrls.CodesGetServiceCodes).pipe(
      map((ret: any) => {
        this._serviceCodes = ret;
        return this._serviceCodes;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }

  getPracticeCodes(): any {
    return this.httpc.get(APIUrls.CodesGetPracticeCodes).pipe(
      map((ret: any) => {
        this._practiceCodes = ret;
        return this._practiceCodes;
      }),
      catchError((e: any) => {
        console.log("Service returned ERROR");
        return Observable.throw(e);
      })
    );
  }
}
