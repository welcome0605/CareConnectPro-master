import { Injectable, EventEmitter } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Response, Headers } from "@angular/http";
import { JsonPipe } from "@angular/common";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";
import {
  Address,
  Patient,
  PatientRelative,
  ReferralDoctor,
  Employer,
  HealthConditionType,
  PatientHealthCondition,
  Allergies,
  AllergyType,
  WorkflowProcess,
  TaskList,
  ContactType,
  IdType,
  Contact,
  Identification,
  Physician,
  AddressType,
  PatientMedicalInsurance,
  Medication,
  PaymentProfile,
  PatientPaymentTransaction,
  PatientAllergy
} from "model-lib";
import { SecurityService } from "./security.service";
import { BaseMethod } from "../shared";
import { isNgTemplate } from "@angular/compiler";

@Injectable({
  providedIn: "root"
})
export class PatientInTakeService extends BaseMethod {
  private patient: Patient = {};
  private isNewPatient: boolean = false;
  private isInsAuthorizationReceived: boolean = false;
  private stagedPhysicians: Physician[] = [];
  private stagedRelatives: PatientRelative[] = [];
  private stagedEmployers: Employer[] = [];
  private stagedAllergies: PatientAllergy[] = [];
  private stagedMedications: Medication[] = [];
  private stagedDiagnosis: PatientHealthCondition[] = [];
  private stagedInsurance: PatientMedicalInsurance[] = [];
  private stagedPaymentProfile: PaymentProfile[] = [];
  private stagedPaymentTransactions: PatientPaymentTransaction[];
  public isPatientRecordChanged: Subject<boolean> = new Subject<boolean>();

  constructor(private securityService: SecurityService) {
    super();
  }

  /**
   * Method - Determine is patient is new or existing
   */
  getIsNewPatient(): boolean {
    return this.isNewPatient;
  }

  /**
   * Method - Update the IsNewPatient value.
   * @param val
   */
  updateIsNewPatient(val: boolean) {
    this.isNewPatient = val;
  }

  /**
   * Method - Get patient object from service
   */
  getPatient() {
    return this.patient;
  }

  /**
   * Method - Update patient data
   * @param _patient
   */
  updatePatient(_patient: Patient) {
    this.patient = _patient;
    this.isPatientRecordChanged.next(true);
  }

  /**
   * Method - Get workflow task list
   */
  getIntakeTaskLists(): TaskList[] {
    let intakeTaskLists: TaskList[] = [];
    intakeTaskLists = [
      {
        id: 1,
        description: "Patient Demographic",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 2,
        description: "Patient Address",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 3,
        description: "Patient Relative Information",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 4,
        description: "Referral Doctor",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 5,
        description: "Employer Information",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 6,
        description: "Insurance Information",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 7,
        description: "Confirm Benefits and Eligibility",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 8,
        description: "Get Initial Authorization",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      },
      {
        id: 9,
        description: "Doctor Orders and Medication Therapies",
        isCompleted: false,
        processName: WorkflowProcess.PatientInTake
      }
    ];
    return intakeTaskLists;
  }

  /**
   * Method - Undo default values
   */
  revertIntakeData() {
    return null;
  }

  /**
   * Method - Life cycle hook - component init
   */
  protected initData() {
    this.isInsAuthorizationReceived = false;
  }

  /**
   * Method - Get identification
   *
   */
  getIdentification(idType: IdType): Identification {
    let tmpVal: Identification = {};
    if (!!this.patient.identifications) {
      const tmpValArray = this.patient.identifications.filter(
        item => item.idTypeId === idType
      );
      if (tmpValArray.length > 0) {
        tmpVal = tmpValArray[0];
      }
    }
    return tmpVal;
  }

  /**
   * Method - Retrieve and return patient employers
   */
  getPatientEmployers(): Employer[] {
    let employers: Employer[] = [];
    if (!!this.patient.employers) {
      employers = this.patient.employers;
    }
    return employers;
  }

  /**
   * Method - Retrieve and return patient employers
   */
  getPatientHealthConditions(): PatientHealthCondition[] {
    let patHealthConditions: PatientHealthCondition[] = [];
    if (!!this.patient.diagnosis) {
      patHealthConditions = this.patient.diagnosis;
    }
    return patHealthConditions;
  }

  /**
   * Method - Retrieve and return patient medical insurances
   */
  getPatientInsurances(): PatientMedicalInsurance[] {
    let insurances: PatientMedicalInsurance[] = [];
    if (!!this.patient.insurance) {
      insurances = this.patient.insurance;
    }
    return insurances;
  }

  /**
   * Method - Add or Update patient relative
   */
  addUpdatePatientInsurance(insurance: PatientMedicalInsurance) {
    if (this.patient.insurance === undefined) {
      this.patient.insurance = [];
    }
    const idx = this.patient.insurance.findIndex(
      item =>
        item.insuranceProviderId === insurance.insuranceProviderId &&
        item.groupNumber === insurance.groupNumber &&
        item.id === insurance.id
    );
    if (idx > -1) {
      this.patient.insurance[idx] = insurance;
    } else {
      this.patient.insurance.push(insurance);
    }
  }

  /**
   * Method - Add or update patient diagnosis
   * @param _diagnosis
   */
  addUpdatePatientHealthConditions(_diagnosis: PatientHealthCondition[]) {
    this.patient.diagnosis = _diagnosis;
  }

  /**
   * Method - Add or Update patient relative
   */
  addUpdatePatientEmployers(employer: Employer) {
    if (this.patient.employers === undefined) {
      this.patient.employers = [];
    }
    if (!!employer.id) {
      const idx = this.patient.employers.findIndex(
        item => item.id === employer.id
      );
      if (idx > -1) {
        this.patient.employers[idx] = employer;
      } else {
        this.patient.employers.push(employer);
      }
    } else {
      this.patient.employers.push(employer);
    }
  }

  /**
   * Method - Retrieve and return patient relative
   */
  getPatientReferrals(): Physician[] {
    let referrals: Physician[] = [];
    if (!!this.patient.referrals) {
      referrals = this.patient.referrals;
    }
    return referrals;
  }

  /**
   * Method - Add or Update patient relative
   */
  addUpdatePatientReferrals(referral: Physician) {
    if (this.patient.referrals === undefined) {
      this.patient.referrals = [];
    }
    if (!!referral.id) {
      const idx = this.patient.referrals.findIndex(
        item => item.id === referral.id
      );
      if (idx > -1) {
        this.patient.referrals[idx] = referral;
      } else {
        this.patient.referrals.push(referral);
      }
    } else {
      this.patient.referrals.push(referral);
    }
  }

  /**
   * Method - Retrieve and return patient relative
   */
  getPatientRelatives(): PatientRelative[] {
    let relatives: PatientRelative[] = [];
    if (!!this.patient.relatives) {
      relatives = this.patient.relatives;
    }
    return relatives;
  }

  /**
   * Method - Add or Update patient relative
   */
  addUpdatePatientRelative(relative: PatientRelative) {
    if (this.patient.relatives === undefined) {
      this.patient.relatives = [];
    }
    if (!!relative.id) {
      const idx = this.patient.relatives.findIndex(
        item => item.id === relative.id
      );
      if (idx > -1) {
        this.patient.relatives[idx] = relative;
      } else {
        this.patient.relatives.push(relative);
      }
    } else {
      this.patient.relatives.push(relative);
    }
  }

  /**
   * Method - Get contact information
   *
   */
  getContact(contactType: ContactType): Contact {
    let tmpVal: Contact = {};
    if (!!this.patient.contacts) {
      const tmpValArray = this.patient.contacts.filter(
        item => item.contactTypeId === contactType
      );
      if (tmpValArray.length > 0) {
        tmpVal = tmpValArray[0];
      }
    }
    return tmpVal;
  }

  /**
   * Method - Add or update patient contact
   * @param contactType
   * @param val
   */
  addUpdateContactByVal(_contactType: ContactType, val: string) {
    if (!this.patient.contacts) {
      this.patient.contacts = [];
    }
    const isExistIdx = this.patient.contacts.findIndex(
      item => item.contactTypeId === _contactType
    );
    if (isExistIdx > -1) {
      this.patient.contacts[isExistIdx].value = val;
    } else {
      this.patient.contacts.push({
        id: "",
        contactTypeId: _contactType,
        value: val,
        dateCreated: this.patient.dateCreated,
        lastUpdatedDate: this.patient.lastUpdatedDate,
        lastUpdatedUserId: this.patient.lastUpdatedUserId
      });
    }
  }

  /**
   * Method - Retrieve the primary address from patient list of addresses
   */
  getPatientPrimaryAddress(): Address {
    let tmpAddr: Address = {};
    if (!!this.patient.addresses) {
      const tmpAddrArray = this.patient.addresses.filter(
        item => item.isPrimary === true
      );
      if (!!tmpAddrArray) {
        tmpAddr = tmpAddrArray[0];
      }
    }
    return tmpAddr;
  }

  /**
   * Method - Add or Update address into patient address list
   * @param addr
   */
  addUpdatePatientAddress(addr: Address) {
    if (this.patient.addresses === undefined) {
      this.patient.addresses = [];
    }
    if (!!addr.id) {
      const idx = this.patient.addresses.findIndex(item => item.id === addr.id);
      if (idx > -1) {
        this.patient.addresses[idx] = addr;
      } else {
        this.patient.addresses.push(addr);
      }
    } else {
      this.patient.addresses.push(addr);
    }
  }

  /**
   * Method - Add or Update address into patient address list
   * @param addr
   */
  addUpdateReferral(referral: Physician) {
    if (this.patient.referrals === undefined) {
      this.patient.referrals = [];
    }
    if (!!referral.id) {
      const idx = this.patient.referrals.findIndex(
        item => item.id === referral.id
      );
      if (idx > -1) {
        this.patient.referrals[idx] = referral;
      } else {
        this.patient.referrals.push(referral);
      }
    } else {
      this.patient.referrals.push(referral);
    }
  }

  /**
   * Method - Return the uncommited referral physicians that is staged to be saved to the database
   */
  getStagedPhysicians(): Physician[] {
    return this.stagedPhysicians;
  }

  /**
   * Method - Return the uncommited relatives record that is staged to be saved to the database
   */
  getStagedRelatives(): PatientRelative[] {
    return this.stagedRelatives;
  }

  /**
   * Method - Return the uncommited employer record that is staged to be saved to the database
   */
  getStagedEmployers(): Employer[] {
    return this.stagedEmployers;
  }

  /**
   * Method - Return the uncommited patient allergy that is staged to be saved to the database
   */
  getStagedAllergies(): PatientAllergy[] {
    return this.stagedAllergies;
  }

  /**
   * Method - Return the uncommited medication that is staged to be saved to the database
   */
  getStagedMedications(): Medication[] {
    return this.stagedMedications;
  }

  /**
   * Method - Return the uncommited health condition that is staged to be saved to the database
   */
  getStagedDiagnosis(): PatientHealthCondition[] {
    return this.stagedDiagnosis;
  }

  /**
   * Method - Return the uncommited patient medical insurance that is staged to be saved to the database
   */
  getStagedInsurance(): PatientMedicalInsurance[] {
    return this.stagedInsurance;
  }

  /**
   * Method - Return the uncommited payment profile record that is staged to be saved to the database
   */
  getStagedPaymentProfile(): PaymentProfile[] {
    return this.stagedPaymentProfile;
  }

  /**
   * Method - Return the uncommited patient transactions record that is staged to be saved to the database
   */
  getStagedPaymentTransactions(): PatientPaymentTransaction[] {
    return this.stagedPaymentTransactions;
  }

  /**
   * Method - Add or update patient contact
   * @param contactType
   * @param val
   */
  addUpdateIdentificationByVal(_idType: IdType, val: string) {
    if (!this.patient.identifications) {
      this.patient.identifications = [];
    }
    const isExistIdx = this.patient.identifications.findIndex(
      item => item.idTypeId === _idType
    );
    if (isExistIdx > -1) {
      this.patient.identifications[isExistIdx].value = val;
    } else {
      this.patient.identifications.push({
        id: "",
        idTypeId: _idType,
        value: val,
        issueAuthority: "",
        issueDate: new Date(),
        memo: "",
        dateCreated: this.patient.dateCreated,
        lastUpdatedDate: this.patient.lastUpdatedDate,
        lastUpdatedUserId: this.patient.lastUpdatedUserId
      });
    }
  }

  getAllergies(): Allergies[] {
    const allergies: Allergies[] = [
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Morphine"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Ampicilin"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "SAIDS"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Aspirin"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Penicilin"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Cephalosporins"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Codeine"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Tetracycline"
      },
      {
        id: this.getGuid(),
        icdCode: "",
        type: AllergyType.Drug,
        description: "Erythromycin"
      }
    ];
    return allergies;
  }

  getConditionTypeByid(condId: number) {
    switch (condId) {
      case HealthConditionType.Allergy: {
        return "Allergies";
      }
      case HealthConditionType.SeriousAilment: {
        return "Health Conditions";
      }
    }
  }

  getGuid(): string {
    return this.securityService.getNewGuid().subscribe((data: any) => {
      let guid: string = data;
      return guid;
    }, this.logConsoleText);
  }
}
