import {
  GetApiURL,
  GetMediaURL,
  GetCdnURL,
  GetBaseUrl
} from "../functions/app.common.function";
import {
  StateUS,
  CountryCodes,
  CCardType,
  CCYear
} from "../models/common.model";

/**
 * Class for handling Web API Urls
 */
export class APIUrls {
  /**
   * Global constants containing data service URL end points
   */
  public static EmailAuthCode: string = "ho2system1234#";
  public static SendEmailApi: string = GetApiURL() + "api/mail";
  public static GetWebAppRootUrl: string = GetBaseUrl();
  public static ChatHub: string = GetApiURL() + "chathub";
  public static BillingProcessCCard: string =
    GetApiURL() + "api/billing/Processcard";
  public static BillingGetTrialSubscriptionId: string =
    GetApiURL() + "api/billing/GetTrialSubscriptionId";
  public static BillingGetPaidSubscriptionId: string =
    GetApiURL() + "api/billing/GetPaidSubscriptionId";
  public static BillingGetSubscriptionTypes: string =
    GetApiURL() + "api/billing/GetSubscriptionTypes";
  public static BillingSaveUserSubscription: string =
    GetApiURL() + "api/billing/SaveUserSubscription";
  public static AccountGetUserDetails: string =
    GetApiURL() + "api/account/GetUserDetails";
  public static AccountValidateUsername: string =
    GetApiURL() + "api/account/userexists";
  public static AccountAddUser: string = GetApiURL() + "api/account/adduser";
  public static AccountRegisterCompany: string =
    GetApiURL() + "api/account/registerCompany";
  public static AccountLoginUser: string = GetApiURL() + "api/auth/signin";
  public static AccountUpdateUserDetails: string =
    GetApiURL() + "api/account/UpdateUserDetails";
  public static AccountNotifyForgetUser: string =
    GetApiURL() + "api/account/NotifyForgetUser";
  public static AccountNewGuid: string =
    GetApiURL() + "api/account/newaccountguid";
  public static AccountGetUserTypes: string =
    GetApiURL() + "api/account/getusertypes";
  public static AccountGetUserTypeByCode: string =
    GetApiURL() + "api/account/getusertypebycode";
  public static GetChangePasswordToken: string =
    GetApiURL() + "api/auth/getchangepasswordtoken";
  public static ChangeUserPassword: string =
    GetApiURL() + "api/auth/changepassword";
  public static VerifyPasswordRequestToken: string =
    GetApiURL() + "api/auth/verifypwdreqtoken";
  public static GetUserSignedInInfo: string =
    GetApiURL() + "api/auth/getusersignedininfo";
  public static ExtendUserSession: string =
    GetApiURL() + "api/auth/extendusersession";
  public static VerifyUserSession: string =
    GetApiURL() + "api/auth/verifysession";
  public static CompanyApi: string = GetApiURL() + "api/company";
  public static CompanyAddressApi: string = GetApiURL() + "api/companyaddress";
  public static CompanyAddressGetPrimaryLocationId: string =
    GetApiURL() + "api/companymaster/getprimarylocationidbycompanyid";
  public static CompanySubscriptionsApi: string =
    GetApiURL() + "api/subscription";
  public static CompanySettingsApi: string =
    GetApiURL() + "api/companysettings";
  public static CompanyDepartmentsApi: string = GetApiURL() + "api/department";
  public static CompanyRegistration: string = GetApiURL() + "api/registration";
  public static GetCdnServer: string = GetCdnURL();
  public static MediaAttachmentPreview: string =
    GetMediaURL() + "api/media/attachmentpreview";
  public static MediaAttachmentEditorPreview: string =
    GetMediaURL() + "api/media/attachmenteditorpreview";
  public static MediaAttachmentSave: string =
    GetMediaURL() + "api/media/attachmentsave";
  public static GetAttachment: string =
    GetMediaURL() + "api/media/getattachment";
  public static MediaImagesCompanyPreview: string =
    GetMediaURL() + "api/media/imagescompanypreview";
  public static MediaImagesCompanyGetAll: string =
    GetMediaURL() + "api/media/imagescompanygetall";
  public static MediaImagesCompanyDelete: string =
    GetMediaURL() + "api/media/imagescompanydelete";
  public static MediaImagesCompanySave: string =
    GetMediaURL() + "api/media/imagescompanysave";
  public static MediaImagesEmployeePreview: string =
    GetMediaURL() + "api/media/imagesemployeepreview";
  public static MediaImagesEmployeeGetAll: string =
    GetMediaURL() + "api/media/imagesemployeegetall";
  public static MediaImagesEmployeeDelete: string =
    GetMediaURL() + "api/media/imagesemployeedelete";
  public static MediaImagesEmployeeSave: string =
    GetMediaURL() + "api/media/imagesemployeesave";
  public static MediaImagesPhysicianPreview: string =
    GetMediaURL() + "api/media/imagesphysicianpreview";
  public static MediaImagesPhysicianGetAll: string =
    GetMediaURL() + "api/media/imagesphysiciangetall";
  public static MediaImagesPhysicianDelete: string =
    GetMediaURL() + "api/media/imagesphysiciandelete";
  public static MediaImagesPhysicianSave: string =
    GetMediaURL() + "api/media/imagesphysiciansave";
  public static MediaImagesVendorPreview: string =
    GetMediaURL() + "api/media/imagesvendorpreview";
  public static MediaImagesVendorGetAll: string =
    GetMediaURL() + "api/media/imagesvendorgetall";
  public static MediaImagesVendorDelete: string =
    GetMediaURL() + "api/media/imagesvendordelete";
  public static MediaImagesVendorSave: string =
    GetMediaURL() + "api/media/imagesvendorsave";
  public static GetImageEmployee: string =
    GetMediaURL() + "api/media/getimageemployee";
  public static GetImageCompany: string =
    GetMediaURL() + "api/media/getimagecompany";
  public static GetImagePhysician: string =
    GetMediaURL() + "api/media/getimagephysician";
  public static GetImageVendor: string =
    GetMediaURL() + "api/media/getimagevendor";
  public static GetImagePatient: string =
    GetMediaURL() + "api/media/getimagepatient";
  public static GetImageEmployeeTemp: string =
    GetMediaURL() + "api/media/getimageemployeetemp";
  public static GetImageCompanyTemp: string =
    GetMediaURL() + "api/media/getimagecompanytemp";
  public static GetImagePhysicianTemp: string =
    GetMediaURL() + "api/media/getimagephysiciantemp";
  public static GetImageVendorTemp: string =
    GetMediaURL() + "api/media/getimagevendortemp";
  public static GetImagePatientTemp: string =
    GetMediaURL() + "api/media/getimagepatienttemp";
  public static SecurityAddRole: string = GetApiURL() + "api/role/addrole";
  public static SecurityGetAllRoles: string =
    GetApiURL() + "api/role/getallroles";
  public static SecurityUpdateRole: string =
    GetApiURL() + "api/role/updaterole";
  public static SecurityDeleteRole: string =
    GetApiURL() + "api/role/deleterole";
  public static SecurityAddRolePermission: string =
    GetApiURL() + "api/role/addpermission";
  public static SecurityGetPermission: string =
    GetApiURL() + "api/role/getpermission";
  public static SecurityGetAllPermissions: string =
    GetApiURL() + "api/role/getallpermissions";
  public static SecurityUpdatePermission: string =
    GetApiURL() + "api/role/updatepermission";
  public static SecurityDeletePermission: string =
    GetApiURL() + "api/role/deletepermission";
  public static SecurityGetAllAssets: string =
    GetApiURL() + "api/role/getallassets";
  public static EmployeeGetEmployeesSummaryById: string =
    GetApiURL() + "api/employee/getemployeebyid";
  public static EmployeeGetEmployeeByAppUserId: string =
    GetApiURL() + "api/employee/getemployeebyappuserid";
  public static EmployeeGetAllEmployeesSummary: string =
    GetApiURL() + "api/employee/getallemployeessummary";
  public static EmployeeGetActiveEmployeesSummary: string =
    GetApiURL() + "api/employee/getactiveemployeessummary";
  public static EmployeeGetInActiveEmployeesSummary: string =
    GetApiURL() + "api/employee/getinactiveemployeessummary";
  public static EmployeeAddEmployeesSummary: string =
    GetApiURL() + "api/employee/addemployeesummary";
  public static EmployeeUpdateEmployee: string =
    GetApiURL() + "api/employee/updateemployee";
  public static EmployeeDeleteEmployee: string =
    GetApiURL() + "api/employee/deleteemployee";
  public static EmployeeGetAllEmployeeNamesByCompanyId: string =
    GetApiURL() + "api/employee/getallemployeenames";
  public static PhysicianGetPhysicianById: string =
    GetApiURL() + "api/physician/getphysicianbyid";
  public static PhysicianGetAllPhysicians: string =
    GetApiURL() + "api/physician/getallphysicians";
  public static PhysicianGetActivePhysicians: string =
    GetApiURL() + "api/physician/getactivephysicians";
  public static PhysicianGetInActivePhysicians: string =
    GetApiURL() + "api/physician/getinactivephysicians";
  public static PhysicianAddPhysician: string =
    GetApiURL() + "api/physician/addphysician";
  public static PhysicianUpdatePhysician: string =
    GetApiURL() + "api/physician/updatephysician";
  public static PhysicianDeletePhysician: string =
    GetApiURL() + "api/physician/deletephysician";
  public static PhysicianGetPhysicianArea: string =
    GetApiURL() + "api/physician/getphysicianarea";
  public static PhysicianAddPhysicianArea: string =
    GetApiURL() + "api/physician/addphysicianarea";
  public static PhysicianUpdatePhysicianArea: string =
    GetApiURL() + "api/physician/updatephysicianarea";
  public static PhysicianDeletePhysicianArea: string =
    GetApiURL() + "api/physician/deletephysicianarea";
  public static VendorGetVendorById: string =
    GetApiURL() + "api/vendor/getvendorbyid";
  public static VendorGetAllVendors: string =
    GetApiURL() + "api/vendor/getallvendors";
  public static VendorGetAllActiveVendors: string =
    GetApiURL() + "api/vendor/getallactivevendors";
  public static VendorGetAllInActiveVendors: string =
    GetApiURL() + "api/vendor/getallinactivevendors";
  public static VendorAddVendor: string = GetApiURL() + "api/vendor/addvendor";
  public static VendorUpdateVendor: string =
    GetApiURL() + "api/vendor/updatevendor";
  public static VendorDeleteVendor: string =
    GetApiURL() + "api/vendor/deletevendor";
  public static VendorGetVendorServices: string =
    GetApiURL() + "api/vendor/getvendorservices";
  public static VendorAddVendorServices: string =
    GetApiURL() + "api/vendor/addvendorservice";
  public static VendorUpdateVendorServices: string =
    GetApiURL() + "api/vendor/updatevendorservice";
  public static VendorDeleteVendorServices: string =
    GetApiURL() + "api/vendor/deletevendorservice";
  public static CodesGetGenderCodes: string =
    GetApiURL() + "api/codes/getgendercodes";
  public static CodesGetPrefixCodes: string =
    GetApiURL() + "api/codes/getprefixcodes";
  public static CodesGetSuffixCodes: string =
    GetApiURL() + "api/codes/getsuffixcodes";
  public static CodesGetSalaryCodes: string =
    GetApiURL() + "api/codes/getsalarycodes";
  public static CodesGetServiceCodes: string =
    GetApiURL() + "api/codes/getservicecodes";
  public static CodesGetPracticeCodes: string =
    GetApiURL() + "api/codes/getpracticecodes";
  public static IcdOasisGetAllOasisStatus: string =
    GetApiURL() + "api/omp/oasisgetalliscmaster";
  public static IcdOasisGetIcdByKeyword: string =
    GetApiURL() + "api/omp/geticdbykeyword";
  public static IcdOasisGetIcdByCode: string =
    GetApiURL() + "api/omp/geticdbycode";
  public static PatientGetAllPatientHeaderCompanyId: string =
    GetApiURL() + "api/patientmaster/getallpatientheaderbycompanyid";
  public static PatientActivatePatient: string =
    GetApiURL() + "api/patientmaster/activatepatient";
  public static PatientGetPatientAddressByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientaddressbypatientid";
  public static PatientGetPatientPayeeByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientpayeebypatientid";
  public static PatientGetPatientRelativeByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientrelativebypatientid";
  public static PatientGetPatientEmployerByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientemployerbypatientid";
  public static PatientGetPatientMedicationByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientmedicationbypatientid";
  public static PatientGetPatientDiagnosisByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientdiagnosisbypatientid";
  public static PatientGetPatientAllergyByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientallergybypatientid";
  public static PatientGetPatientMedInsuranceByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientmedinsurancebypatientid";
  public static PatientGetPaymentProfileByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientpaymentprofilebypatientid";
  public static PatientGetPaymentTransactionByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientpaymentprofilebypatientid";
  public static PatientGetAllReferralPhysiciansByPatientId: string =
    GetApiURL() + "api/patientmaster/getallpatientphysicianbypatientid";
  public static PatientAddress: string = GetApiURL() + "api/patientaddress";
  public static PatientAllergy: string = GetApiURL() + "api/patientallergy";
  public static Patient: string = GetApiURL() + "api/patient";
  public static PatientDiagnosis: string = GetApiURL() + "api/patientdiagnosis";
  public static PatientEmployer: string = GetApiURL() + "api/patientemployer";
  public static PatientMedInsurance: string =
    GetApiURL() + "api/patientmedinsurance";
  public static PatientMedication: string =
    GetApiURL() + "api/patientmedication";
  public static PatientPayee: string = GetApiURL() + "api/patientpayee";
  public static PatientPaymentProfile: string =
    GetApiURL() + "api/patientpaymentprofile";
  public static PatientPaymentTransaction: string =
    GetApiURL() + "api/patientpaymenttransaction";
  public static PatientRelative: string = GetApiURL() + "api/patientrelative";
  public static MessageAllMessagesByEmployeeId: string =
    GetApiURL() + "api/messagemaster/getallmessagesbyemployeeid";
  public static MessageAllChatMessagesByEmployeeId: string =
    GetApiURL() + "api/messagemaster/getallchatmessagesbyemployeeid";
  public static MessageCreateChatSession: string =
    GetApiURL() + "api/messagemaster/createchatsession";
  public static MessageGetMessageDetail: string =
    GetApiURL() + "api/messagemaster/getmessagedetailbyid";
  public static MessageDeleteMessage: string =
    GetApiURL() + "api/messagemaster/deleteappmessage";
  public static MessageDeleteMessageList: string =
    GetApiURL() + "api/messagemaster/deleteappmessagelist";
  public static SystemBroadcastGetAllMessagesByCompanyId: string =
    GetApiURL() + "api/messagemaster/getallbroadcastmessagesbycompanyid";
  public static SystemBroadcast: string = GetApiURL() + "api/systembroadcast";
  public static AppMessage: string = GetApiURL() + "api/message";
  public static AppChat: string = GetApiURL() + "api/chat";
  public static CalendarEventGetAllEmployeeEventsByEmployeeId: string =
    GetApiURL() + "api/eventmaster/getallemployeeeventsbyemployeeid";
  public static CalendarEventGetAllCompanyEventsByCompanyId: string =
    GetApiURL() + "api/eventmaster/getallcompanyeventsbycompanyid";
  public static CalendarEventCompany: string = GetApiURL() + "api/eventcompany";
  public static InsuranceProvider: string =
    GetApiURL() + "api/insuranceprovider";
  public static InsuranceProviderGetAll: string =
    GetApiURL() + "api/insuranceprovidermaster/getallinsuranceproviders";
  public static CalendarEventEmployee: string =
    GetApiURL() + "api/eventemployee";
}

export class AppUserTypeCodes {
  public static Employee: string = "Employee";
  public static ThirdParty: string = "Third Party";
  public static Physician: string = "Physician";
}

export class CreditCardCodes {
  public static CCardTypes: CCardType[] = [
    { id: 1, value: "Visa" },
    { id: 2, value: "MasterCard" },
    { id: 3, value: "American Express" },
    { id: 4, value: "Discover" }
  ];

  public static CCYears: CCYear[] = [
    { id: 2017, value: 2017 },
    { id: 2018, value: 2018 },
    { id: 2019, value: 2019 },
    { id: 2020, value: 2020 },
    { id: 2020, value: 2020 },
    { id: 2020, value: 2021 },
    { id: 2020, value: 2022 },
    { id: 2020, value: 2023 },
    { id: 2020, value: 2024 },
    { id: 2020, value: 2025 },
    { id: 2020, value: 2026 },
    { id: 2020, value: 2027 },
    { id: 2020, value: 2028 }
  ];
}

export class AddressCodes {
  public static USStates: StateUS[] = [
    {
      value: "Alabama",
      id: "AL"
    },
    {
      value: "Alaska",
      id: "AK"
    },
    {
      value: "American Samoa",
      id: "AS"
    },
    {
      value: "Arizona",
      id: "AZ"
    },
    {
      value: "Arkansas",
      id: "AR"
    },
    {
      value: "California",
      id: "CA"
    },
    {
      value: "Colorado",
      id: "CO"
    },
    {
      value: "Connecticut",
      id: "CT"
    },
    {
      value: "Delaware",
      id: "DE"
    },
    {
      value: "District Of Columbia",
      id: "DC"
    },
    {
      value: "Federated States Of Micronesia",
      id: "FM"
    },
    {
      value: "Florida",
      id: "FL"
    },
    {
      value: "Georgia",
      id: "GA"
    },
    {
      value: "Guam",
      id: "GU"
    },
    {
      value: "Hawaii",
      id: "HI"
    },
    {
      value: "Idaho",
      id: "ID"
    },
    {
      value: "Illinois",
      id: "IL"
    },
    {
      value: "Indiana",
      id: "IN"
    },
    {
      value: "Iowa",
      id: "IA"
    },
    {
      value: "Kansas",
      id: "KS"
    },
    {
      value: "Kentucky",
      id: "KY"
    },
    {
      value: "Louisiana",
      id: "LA"
    },
    {
      value: "Maine",
      id: "ME"
    },
    {
      value: "Marshall Islands",
      id: "MH"
    },
    {
      value: "Maryland",
      id: "MD"
    },
    {
      value: "Massachusetts",
      id: "MA"
    },
    {
      value: "Michigan",
      id: "MI"
    },
    {
      value: "Minnesota",
      id: "MN"
    },
    {
      value: "Mississippi",
      id: "MS"
    },
    {
      value: "Missouri",
      id: "MO"
    },
    {
      value: "Montana",
      id: "MT"
    },
    {
      value: "Nebraska",
      id: "NE"
    },
    {
      value: "Nevada",
      id: "NV"
    },
    {
      value: "New Hampshire",
      id: "NH"
    },
    {
      value: "New Jersey",
      id: "NJ"
    },
    {
      value: "New Mexico",
      id: "NM"
    },
    {
      value: "New York",
      id: "NY"
    },
    {
      value: "North Carolina",
      id: "NC"
    },
    {
      value: "North Dakota",
      id: "ND"
    },
    {
      value: "Northern Mariana Islands",
      id: "MP"
    },
    {
      value: "Ohio",
      id: "OH"
    },
    {
      value: "Oklahoma",
      id: "OK"
    },
    {
      value: "Oregon",
      id: "OR"
    },
    {
      value: "Palau",
      id: "PW"
    },
    {
      value: "Pennsylvania",
      id: "PA"
    },
    {
      value: "Puerto Rico",
      id: "PR"
    },
    {
      value: "Rhode Island",
      id: "RI"
    },
    {
      value: "South Carolina",
      id: "SC"
    },
    {
      value: "South Dakota",
      id: "SD"
    },
    {
      value: "Tennessee",
      id: "TN"
    },
    {
      value: "Texas",
      id: "TX"
    },
    {
      value: "Utah",
      id: "UT"
    },
    {
      value: "Vermont",
      id: "VT"
    },
    {
      value: "Virgin Islands",
      id: "VI"
    },
    {
      value: "Virginia",
      id: "VA"
    },
    {
      value: "Washington",
      id: "WA"
    },
    {
      value: "West Virginia",
      id: "WV"
    },
    {
      value: "Wisconsin",
      id: "WI"
    },
    {
      value: "Wyoming",
      id: "WY"
    }
  ];

  public static GlobalCountryCodes: CountryCodes[] = [
    { value: "Afghanistan", id: "AF" },
    { value: "Åland Islands", id: "AX" },
    { value: "Albania", id: "AL" },
    { value: "Algeria", id: "DZ" },
    { value: "American Samoa", id: "AS" },
    { value: "AndorrA", id: "AD" },
    { value: "Angola", id: "AO" },
    { value: "Anguilla", id: "AI" },
    { value: "Antarctica", id: "AQ" },
    { value: "Antigua and Barbuda", id: "AG" },
    { value: "Argentina", id: "AR" },
    { value: "Armenia", id: "AM" },
    { value: "Aruba", id: "AW" },
    { value: "Australia", id: "AU" },
    { value: "Austria", id: "AT" },
    { value: "Azerbaijan", id: "AZ" },
    { value: "Bahamas", id: "BS" },
    { value: "Bahrain", id: "BH" },
    { value: "Bangladesh", id: "BD" },
    { value: "Barbados", id: "BB" },
    { value: "Belarus", id: "BY" },
    { value: "Belgium", id: "BE" },
    { value: "Belize", id: "BZ" },
    { value: "Benin", id: "BJ" },
    { value: "Bermuda", id: "BM" },
    { value: "Bhutan", id: "BT" },
    { value: "Bolivia", id: "BO" },
    { value: "Bosnia and Herzegovina", id: "BA" },
    { value: "Botswana", id: "BW" },
    { value: "Bouvet Island", id: "BV" },
    { value: "Brazil", id: "BR" },
    { value: "British Indian Ocean Territory", id: "IO" },
    { value: "Brunei Darussalam", id: "BN" },
    { value: "Bulgaria", id: "BG" },
    { value: "Burkina Faso", id: "BF" },
    { value: "Burundi", id: "BI" },
    { value: "Cambodia", id: "KH" },
    { value: "Cameroon", id: "CM" },
    { value: "Canada", id: "CA" },
    { value: "Cape Verde", id: "CV" },
    { value: "Cayman Islands", id: "KY" },
    { value: "Central African Republic", id: "CF" },
    { value: "Chad", id: "TD" },
    { value: "Chile", id: "CL" },
    { value: "China", id: "CN" },
    { value: "Christmas Island", id: "CX" },
    { value: "Cocos (Keeling) Islands", id: "CC" },
    { value: "Colombia", id: "CO" },
    { value: "Comoros", id: "KM" },
    { value: "Congo", id: "CG" },
    { value: "Congo, The Democratic Republic of the", id: "CD" },
    { value: "Cook Islands", id: "CK" },
    { value: "Costa Rica", id: "CR" },
    { value: "Cote D'Ivoire", id: "CI" },
    { value: "Croatia", id: "HR" },
    { value: "Cuba", id: "CU" },
    { value: "Cyprus", id: "CY" },
    { value: "Czech Republic", id: "CZ" },
    { value: "Denmark", id: "DK" },
    { value: "Djibouti", id: "DJ" },
    { value: "Dominica", id: "DM" },
    { value: "Dominican Republic", id: "DO" },
    { value: "Ecuador", id: "EC" },
    { value: "Egypt", id: "EG" },
    { value: "El Salvador", id: "SV" },
    { value: "Equatorial Guinea", id: "GQ" },
    { value: "Eritrea", id: "ER" },
    { value: "Estonia", id: "EE" },
    { value: "Ethiopia", id: "ET" },
    { value: "Falkland Islands (Malvinas)", id: "FK" },
    { value: "Faroe Islands", id: "FO" },
    { value: "Fiji", id: "FJ" },
    { value: "Finland", id: "FI" },
    { value: "France", id: "FR" },
    { value: "French Guiana", id: "GF" },
    { value: "French Polynesia", id: "PF" },
    { value: "French Southern Territories", id: "TF" },
    { value: "Gabon", id: "GA" },
    { value: "Gambia", id: "GM" },
    { value: "Georgia", id: "GE" },
    { value: "Germany", id: "DE" },
    { value: "Ghana", id: "GH" },
    { value: "Gibraltar", id: "GI" },
    { value: "Greece", id: "GR" },
    { value: "Greenland", id: "GL" },
    { value: "Grenada", id: "GD" },
    { value: "Guadeloupe", id: "GP" },
    { value: "Guam", id: "GU" },
    { value: "Guatemala", id: "GT" },
    { value: "Guernsey", id: "GG" },
    { value: "Guinea", id: "GN" },
    { value: "Guinea-Bissau", id: "GW" },
    { value: "Guyana", id: "GY" },
    { value: "Haiti", id: "HT" },
    { value: "Heard Island and Mcdonald Islands", id: "HM" },
    { value: "Holy See (Vatican City State)", id: "VA" },
    { value: "Honduras", id: "HN" },
    { value: "Hong Kong", id: "HK" },
    { value: "Hungary", id: "HU" },
    { value: "Iceland", id: "IS" },
    { value: "India", id: "IN" },
    { value: "Indonesia", id: "ID" },
    { value: "Iran, Islamic Republic Of", id: "IR" },
    { value: "Iraq", id: "IQ" },
    { value: "Ireland", id: "IE" },
    { value: "Isle of Man", id: "IM" },
    { value: "Israel", id: "IL" },
    { value: "Italy", id: "IT" },
    { value: "Jamaica", id: "JM" },
    { value: "Japan", id: "JP" },
    { value: "Jersey", id: "JE" },
    { value: "Jordan", id: "JO" },
    { value: "Kazakhstan", id: "KZ" },
    { value: "Kenya", id: "KE" },
    { value: "Kiribati", id: "KI" },
    { value: "Korea, Democratic People's Republic of", id: "KP" },
    { value: "Korea, Republic of", id: "KR" },
    { value: "Kuwait", id: "KW" },
    { value: "Kyrgyzstan", id: "KG" },
    { value: "Lao People's Democratic Republic", id: "LA" },
    { value: "Latvia", id: "LV" },
    { value: "Lebanon", id: "LB" },
    { value: "Lesotho", id: "LS" },
    { value: "Liberia", id: "LR" },
    { value: "Libyan Arab Jamahiriya", id: "LY" },
    { value: "Liechtenstein", id: "LI" },
    { value: "Lithuania", id: "LT" },
    { value: "Luxembourg", id: "LU" },
    { value: "Macao", id: "MO" },
    { value: "Macedonia, The Former Yugoslav Republic of", id: "MK" },
    { value: "Madagascar", id: "MG" },
    { value: "Malawi", id: "MW" },
    { value: "Malaysia", id: "MY" },
    { value: "Maldives", id: "MV" },
    { value: "Mali", id: "ML" },
    { value: "Malta", id: "MT" },
    { value: "Marshall Islands", id: "MH" },
    { value: "Martinique", id: "MQ" },
    { value: "Mauritania", id: "MR" },
    { value: "Mauritius", id: "MU" },
    { value: "Mayotte", id: "YT" },
    { value: "Mexico", id: "MX" },
    { value: "Micronesia, Federated States of", id: "FM" },
    { value: "Moldova, Republic of", id: "MD" },
    { value: "Monaco", id: "MC" },
    { value: "Mongolia", id: "MN" },
    { value: "Montserrat", id: "MS" },
    { value: "Morocco", id: "MA" },
    { value: "Mozambique", id: "MZ" },
    { value: "Myanmar", id: "MM" },
    { value: "Namibia", id: "NA" },
    { value: "Nauru", id: "NR" },
    { value: "Nepal", id: "NP" },
    { value: "Netherlands", id: "NL" },
    { value: "Netherlands Antilles", id: "AN" },
    { value: "New Caledonia", id: "NC" },
    { value: "New Zealand", id: "NZ" },
    { value: "Nicaragua", id: "NI" },
    { value: "Niger", id: "NE" },
    { value: "Nigeria", id: "NG" },
    { value: "Niue", id: "NU" },
    { value: "Norfolk Island", id: "NF" },
    { value: "Northern Mariana Islands", id: "MP" },
    { value: "Norway", id: "NO" },
    { value: "Oman", id: "OM" },
    { value: "Pakistan", id: "PK" },
    { value: "Palau", id: "PW" },
    { value: "Palestinian Territory, Occupied", id: "PS" },
    { value: "Panama", id: "PA" },
    { value: "Papua New Guinea", id: "PG" },
    { value: "Paraguay", id: "PY" },
    { value: "Peru", id: "PE" },
    { value: "Philippines", id: "PH" },
    { value: "Pitcairn", id: "PN" },
    { value: "Poland", id: "PL" },
    { value: "Portugal", id: "PT" },
    { value: "Puerto Rico", id: "PR" },
    { value: "Qatar", id: "QA" },
    { value: "Reunion", id: "RE" },
    { value: "Romania", id: "RO" },
    { value: "Russian Federation", id: "RU" },
    { value: "RWANDA", id: "RW" },
    { value: "Saint Helena", id: "SH" },
    { value: "Saint Kitts and Nevis", id: "KN" },
    { value: "Saint Lucia", id: "LC" },
    { value: "Saint Pierre and Miquelon", id: "PM" },
    { value: "Saint Vincent and the Grenadines", id: "VC" },
    { value: "Samoa", id: "WS" },
    { value: "San Marino", id: "SM" },
    { value: "Sao Tome and Principe", id: "ST" },
    { value: "Saudi Arabia", id: "SA" },
    { value: "Senegal", id: "SN" },
    { value: "Serbia and Montenegro", id: "CS" },
    { value: "Seychelles", id: "SC" },
    { value: "Sierra Leone", id: "SL" },
    { value: "Singapore", id: "SG" },
    { value: "Slovakia", id: "SK" },
    { value: "Slovenia", id: "SI" },
    { value: "Solomon Islands", id: "SB" },
    { value: "Somalia", id: "SO" },
    { value: "South Africa", id: "ZA" },
    { value: "South Georgia and the South Sandwich Islands", id: "GS" },
    { value: "Spain", id: "ES" },
    { value: "Sri Lanka", id: "LK" },
    { value: "Sudan", id: "SD" },
    { value: "Suriname", id: "SR" },
    { value: "Svalbard and Jan Mayen", id: "SJ" },
    { value: "Swaziland", id: "SZ" },
    { value: "Sweden", id: "SE" },
    { value: "Switzerland", id: "CH" },
    { value: "Syrian Arab Republic", id: "SY" },
    { value: "Taiwan, Province of China", id: "TW" },
    { value: "Tajikistan", id: "TJ" },
    { value: "Tanzania, United Republic of", id: "TZ" },
    { value: "Thailand", id: "TH" },
    { value: "Timor-Leste", id: "TL" },
    { value: "Togo", id: "TG" },
    { value: "Tokelau", id: "TK" },
    { value: "Tonga", id: "TO" },
    { value: "Trinidad and Tobago", id: "TT" },
    { value: "Tunisia", id: "TN" },
    { value: "Turkey", id: "TR" },
    { value: "Turkmenistan", id: "TM" },
    { value: "Turks and Caicos Islands", id: "TC" },
    { value: "Tuvalu", id: "TV" },
    { value: "Uganda", id: "UG" },
    { value: "Ukraine", id: "UA" },
    { value: "United Arab Emirates", id: "AE" },
    { value: "United Kingdom", id: "GB" },
    { value: "United States", id: "US" },
    { value: "United States Minor Outlying Islands", id: "UM" },
    { value: "Uruguay", id: "UY" },
    { value: "Uzbekistan", id: "UZ" },
    { value: "Vanuatu", id: "VU" },
    { value: "Venezuela", id: "VE" },
    { value: "Viet Nam", id: "VN" },
    { value: "Virgin Islands, British", id: "VG" },
    { value: "Virgin Islands, U.S.", id: "VI" },
    { value: "Wallis and Futuna", id: "WF" },
    { value: "Western Sahara", id: "EH" },
    { value: "Yemen", id: "YE" },
    { value: "Zambia", id: "ZM" },
    { value: "Zimbabwe", id: "ZW" }
  ];
}
