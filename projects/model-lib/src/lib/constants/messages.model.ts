export class Message {
  public static SendMessageFailedGeneralError: string =
    "System unable to send the message. Please contact CareConnect Pro support.";
  public static SendMessageSuccessGeneralInfo: string =
    "Message successfully sent.";
  public static SendMessageFailedCaptchaNotClicked: string =
    "Captcha checkbox was not clicked.";
  public static ResetEmailSentCheckEmail: string =
    "Please check your email for the instructions to reset your password.";
  public static ResetEmailSubject: string = "CareConnect Pro Password Reset";
  public static ResetPasswordSuccess: string = "Password successfully changed";
  public static ResetPasswordFailed: string =
    "System unable to change password. Please contact CareConnect Pro support. ";
  public static VerifyResetPasswordTokenFailed: string =
    "System unable to verify password reset token. Please contact CareConnect Pro support.. ";
  public static LoginFailedUserOrPasswordIncorrect: string =
    "Login failed. Username or password is incorrect.";
  public static ErrorEmployeeRetrieveEmployeeNames: string =
    "Unable to retrieve names of employees in the database";
  public static ErrorGetMessageDetailFailure: string =
    "Unable to retrieve message detail from the database";
  public static GetAllChatHeadersFailed: string =
    "Unable to retrieve chat messages from database";
  public static GetAllChatDetailFailed: string =
    "Unable to retrieve chat details from database";
  public static PostChatDetailFailed: string = "Unable to post chat to server";
  public static GetEventCalenderFailed: string =
    "Unable to retrieve event calendar from the database";
  public static GetSystemBroadcastFailed: string =
    "Unable to retrieve system broadcast messages from the database";
  public static PostSystemBroadcastFailed: string =
    "Unable to post system broadcast messages to server";
  public static PostPatientIntakeFailed: string =
    "Unable to save patient intake to server";
  public static GetPatientIntakeFailed: string =
    "Unable to retrieve patient intake from server";
  public static DeletePatientIntakeFailed: string =
    "Unable to delete patient intake from server";
  public static ErrorUnableToRetrieveCompanyPrimaryAddress: string =
    "Unable to retrieve company primary address from database";
  public static ErrorGetDatabaseRecordFailed: string =
    "Unable to retrieve record from database";
  public static ErrorSaveDatabaseRecordFailed: string =
    "Unable to save record to database";
  public static ErrorUpdateDatabaseRecordFailed: string =
    "Unable to update record to database";
  public static ErrorDeleteDatabaseRecordFailed: string =
    "Unable to delete record to database";
}
