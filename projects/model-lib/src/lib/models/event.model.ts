import { FileAttachment } from "./common.model";

export interface AppEventBase {
  id?: string;
  userId?: string;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  detail?: string;
  fileAttachments?: FileAttachment[];
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUser?: string;
}

export interface AppEventCompany extends AppEventBase {
  companyId?: string;
}

export interface UiCalendarEvent {
  id?: string;
  start?: Date;
  start_time?: string;
  end?: Date;
  end_time?: string;
  title?: string;
  description?: string;
}

export interface AppEventHeaderBase {
  id?: string;
  userId?: string;
  title?: string;
  detail?: string;
  fileAttachment?: number;
  startDate?: Date;
  endDate?: Date;
}
