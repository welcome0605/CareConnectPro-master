import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";

export const APP_CONFIG = {
  apiUrl: "example/api/",
  url: "example/"
};

export const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: APP_CONFIG.apiUrl + "files",
  maxFilesize: 50,
  acceptedFiles: "image/*,application/*,text/*,audio/*,video/*,multipart/*",
  clickable: true,
  uploadMultiple: false,
  addRemoveLinks: true,
  dictRemoveFile:
    '<i class="icofont icofont-ui-delete text-c-pink f-16 m-l-10"></i>'
};
