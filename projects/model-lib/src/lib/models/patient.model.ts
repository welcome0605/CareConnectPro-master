import { People, Place, Address, Contact } from "./peopleplace.model";
import {
  PatientRelationshipType,
  AllergyType,
  InsuranceNetworkStatus,
  EmploymentType
} from "../enums";
import { BaseModel } from "./base.model";
import { DecimalPipe } from "@angular/common";

export interface Patient extends People {
  id?: string;
  nomalizedId?: string;
  companyId?: string;
  status?: string;
  primaryLocationId?: string;
  isActive?: boolean;
  medPrograms?: MedProgram[];
  payees?: Payee[];
  relatives?: PatientRelative[];
  employers?: Employer[];
  referrals?: ReferralDoctor[];
  allergies?: PatientAllergy[];
  billingPreferenceId?: string;
  medications?: Medication[];
  diagnosis?: PatientHealthCondition[];
  insurance?: PatientMedicalInsurance[];
  paymentProfile?: PaymentProfile[];
  paymentTransactions?: PatientPaymentTransaction[];
}

export interface PatientHeader {
  id?: string;
  normalizedId?: number;
  prefix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  photoName?: string;
}

export interface PaymentProfile extends BaseModel {
  id?: string;
  patientId?: string;
  isPrimary?: string;
  paymentTypeId?: string;
  cardNumber?: string;
  cardTypeId?: string;
  cardCvv?: string;
  cardExpDate?: Date;
  bankRoutingNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  notes?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingAddress3?: string;
  billingCity?: string;
  billingState?: string;
  billingZipCode?: string;
  billingCountry?: string;
}

export interface MedProgram extends BaseModel {
  id?: string;
  patientId?: string;
  programId?: string;
  notes?: string;
}

export interface Payee extends People {
  id?: string;
  patientId?: string;
  companyName?: string;
  taxId?: string;
}

export interface PatientRelative extends People {
  id?: string;
  patientId?: string;
  relationshipId?: PatientRelationshipType;
}

export interface Employer extends Place {
  id?: string;
  patientId?: string;
  employmentTypeId?: EmploymentType;
  name?: string;
}

export interface BillingPreference {
  patientId?: string;
  medicare?: boolean;
  selfPay?: boolean;
  insurance?: boolean;
  cardUpload?: boolean;
}

export interface MedicalInsuranceProvider extends BaseModel {
  id?: string;
  normalizedId?: number;
  longName?: string;
  name?: string;
  addresses?: Address[];
  contacts?: Contact[];
}

export interface PatientMedicalInsurance extends BaseModel {
  id?: string;
  patientId?: string;
  insuranceProviderId?: string;
  memberId?: string;
  groupNumber?: string;
  authorizationRequired?: boolean;
  referralRequired?: boolean;
  deductibleAmount?: number;
  networkStatus?: InsuranceNetworkStatus;
  authorizationCode?: string;
  authorizationReceived?: boolean;
}

export interface Medication extends BaseModel {
  id?: string;
  patientId?: string;
  icdId?: string;
  medName?: string;
  physicianId?: string;
}

export interface PatientHealthCondition extends BaseModel {
  id?: string;
  patientId?: string;
  icdId?: string;
  notes?: string;
  medProviderId?: string;
  physicianId?: string;
  conditionTypeId?: string;
}

export interface PatientPaymentTransaction extends BaseModel {
  id?: string;
  paymentProfileId?: string;
  patientId?: string;
  amount?: number;
  approvalCode?: string;
}

export interface PatientAllergy extends BaseModel {
  id?: string;
  patientId?: string;
  icdId?: string;
  allergyTypeId?: string;
  notes?: string;
}

export interface Allergies {
  id?: string;
  icdCode?: string;
  type?: AllergyType;
  description?: string;
}

export interface AppAllergies extends Allergies {
  isSelected?: boolean;
}

export interface Provider extends Place {
  id?: string;
  patientId?: string;
}

export interface ReferralDoctor extends BaseModel {
  id?: string;
  patientId?: string;
  physicianId?: string;
}
