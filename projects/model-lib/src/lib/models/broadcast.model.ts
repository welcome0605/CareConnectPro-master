import { FileAttachment } from "./common.model";

export interface SystemBroadcastDetail extends SystemBroadcastBase {
  message?: string;
  fileAttachments?: FileAttachment[];
}

export interface SystemBroadcastHeader extends SystemBroadcastBase {
  fileAttachmentCount?: number;
}

export interface SystemBroadcastBase {
  id?: string;
  companyId?: string;
  senderId?: string;
  subject?: string;
  dateCreated?: Date;
}
