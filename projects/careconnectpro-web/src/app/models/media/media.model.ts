export interface IMediaFile {
  fileName: string;
  filePath: string;
  companyFile: string;
  employeeFile: string;
  physicianFile: string;
  vendorFile: string;
}

export class MediaFile implements IMediaFile {
  fileName: string;
  filePath: string;
  companyFile: string;
  employeeFile: string;
  physicianFile: string;
  vendorFile: string;
}
