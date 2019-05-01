import { File } from "./file.model";
import { FileAttachment } from "./common.model";
import { MailType } from "../enums";

export interface Mail {
  id?: number;
  sender?: string;
  senderImage?: string;
  senderEmail?: string;
  subject?: string;
  message?: string;
  date?: string;
  type?: MailType;
  isFavorite?: boolean;
  files?: File[];
  typeMessage?: string;
}

export interface AppMessageRequest {
  id?: string;
  recipientId?: string;
  mailboxId?: string;
}

export interface AppMessageHeader {
  id?: string;
  senderId?: string;
  senderName?: string;
  isFavorite?: boolean;
  isRead?: boolean;
  subject?: string;
  fileAttachment?: number;
  dateCreated?: Date;
}

export interface AppChatHeader {
  chatId?: string;
  chatUsers?: string[];
  employeeId?: string;
}

export interface AppMessageDetail {
  id?: string;
  senderId?: string;
  subject?: string;
  message?: string;
  messageFolderId?: string;
  isFavorite?: boolean;
  isRead?: boolean;
  fileAttachmentCount?: number;
  dateCreated?: Date;
  lastUpdatedDate?: Date;
  lastUpdatedUser?: string;
  recipients?: string[];
  fileAttachments?: FileAttachment[];
}

export interface ChatRequest {
  employeeId?: string;
  recipients?: string[];
}

export interface ChatDiscussion {
  id?: string;
  message?: string;
  date?: string;
  contactInfo?: ChatContact;
  senderInfo?: boolean;
}

export interface AppChatDetail {
  id?: string;
  chatId?: string;
  userId?: string;
  message?: string;
  attachmentId?: string;
  attachmentName?: string;
  dateCreated?: Date;
}

export interface ChatSession {
  chatId?: string;
  chatUsers?: ChatContact[];
}

export interface ChatContact {
  id?: string;
  fullName?: string;
  image?: string;
  status?: string;
}
