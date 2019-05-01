export interface IscMaster extends IscValues {
  iscMasterKey?: string;
  iscId?: string;
  iscTxt?: string;
}

export interface IscValues {
  iscIdKey?: string;
  iscId?: string;
  iscMasterKey?: string;
  transTypeCdValue?: string;
  transTypeCdTxt?: string;
  m0100AssmtReasonVal?: string;
  m0100AssmtReasonTxt?: string;
}

export interface IcdCodeMaster {
  icdId?: string;
  code?: string;
  description?: string;
}

export interface IcdCode extends IcdCodeMaster {
  isSelected?: boolean;
}
