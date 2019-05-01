import { BaseModel } from "./base.model";
import { People } from "./peopleplace.model";

export interface Physician extends People {
  id?: string;
  normalizedId?: number;
  companyId?: string;
  jobTitle?: string;
  isActive?: boolean;
  notes?: string;
  practices?: PhysicianPracticeArea[];
}

export interface PhysicianPracticeArea extends BaseModel {
  id?: string;
  physicianId?: string;
  practiceCodeId?: string;
}
