export const ACTION_TYPES = {
  GLOBAL_LOCATION_CHANGE: "@@router/LOCATION_CHANGE",
  GLOBAL_DIALOG_OPEN: Symbol("GLOBAL_DIALOG_OPEN"),
  GLOBAL_DIALOG_CLOSE: Symbol("GLOBAL_DIALOG_CLOSE"),
  GLOBAL_CHANGE_DIALOG_TYPE: Symbol("GLOBAL_CHANGE_DIALOG_TYPE"),
  GLOBAL_ALERT_NOTIFICATION: Symbol("GLOBAL_ALERT_NOTIFICATION"),
  GLOBAL_CLEAR_NOTIFICATION: Symbol("GLOBAL_CLEAR_NOTIFICATION"),

  SIGN_IN_CHANGE_EMAIL_INPUT: Symbol("SIGN_IN.CHANGE_EMAIL_INPUT"),
  SIGN_IN_CHANGE_PASSWORD_INPUT: Symbol("SIGN_IN.CHANGE_PASSWORD_INPUT"),
  SIGN_IN_ON_FOCUS_INPUT: Symbol("SIGN_IN.ON_FOCUS_INPUT"),
  SIGN_IN_ON_BLUR_INPUT: Symbol("SIGN_IN.ON_BLUR_INPUT"),
  SIGN_IN_FORM_ERROR: Symbol("SIGN_IN.FORM_ERROR"),

  SIGN_IN_START_TO_SIGN_IN: Symbol("SIGN_IN.START_TO_SIGN_IN"),
  SIGN_IN_FAILED_TO_SIGN_IN: Symbol("SIGN_IN.FAILED_TO_SIGN_IN"),
  SIGN_IN_SUCCEEDED_TO_SIGN_IN: Symbol("SIGN_IN.SUCCEEDED_TO_SIGN_IN"),

  SIGN_IN_GET_AUTHORIZE_CODE: Symbol("SIGN_IN.GET_AUTHORIZE_CODE"),
  SIGN_IN_GO_BACK: Symbol("SIGN_IN.GO_BACK"),

  SIGN_UP_CHANGE_EMAIL_INPUT: Symbol("SIGN_UP.CHANGE_EMAIL_INPUT"),
  SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL: Symbol("SIGN_UP.SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL"),
  SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL: Symbol("SIGN_UP.FAILED_TO_CHECK_DUPLICATED_EMAIL"),

  SIGN_UP_CHANGE_PASSWORD_INPUT: Symbol("SIGN_UP.CHANGE_PASSWORD_INPUT"),
  SIGN_UP_CHANGE_NAME_INPUT: Symbol("SIGN_UP.CHANGE_NAME_INPUT"),
  SIGN_UP_CHANGE_AFFILIATION_INPUT: Symbol("SIGN_UP.CHANGE_AFFILIATION_INPUT"),

  SIGN_UP_FORM_ERROR: Symbol("SIGN_UP.FORM_ERROR"),
  SIGN_UP_REMOVE_FORM_ERROR: Symbol("SIGN_UP.REMOVE_FORM_ERROR"),

  SIGN_UP_ON_FOCUS_INPUT: Symbol("SIGN_UP.ON_FOCUS_INPUT"),
  SIGN_UP_ON_BLUR_INPUT: Symbol("SIGN_UP.ON_BLUR_INPUT"),

  SIGN_UP_START_TO_CREATE_ACCOUNT: Symbol("SIGN_UP.START_TO_CREATE_ACCOUNT"),
  SIGN_UP_FAILED_TO_CREATE_ACCOUNT: Symbol("SIGN_UP.FAILED_TO_CREATE_ACCOUNT"),
  SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT: Symbol("SIGN_UP.SUCCEEDED_TO_CREATE_ACCOUNT"),

  SIGN_UP_CHANGE_SIGN_UP_STEP: Symbol("SIGN_UP.CHANGE_SIGN_UP_STEP"),
  SIGN_UP_GET_AUTHORIZE_CODE: Symbol("SIGN_UP.GET_AUTHORIZE_CODE"),
  SIGN_UP_START_TO_EXCHANGE: Symbol("SIGN_UP.START_TO_EXCHANGE"),
  SIGN_UP_FAILED_TO_EXCHANGE: Symbol("SIGN_UP.FAILED_TO_EXCHANGE"),
  SIGN_UP_SUCCEEDED_TO_EXCHANGE: Symbol("SIGN_UP.SUCCEEDED_TO_EXCHANGE"),
  SIGN_UP_FIX_INPUT: Symbol("SIGN_UP.FIX_INPUT"),
  SIGN_UP_GO_BACK: Symbol("SIGN_UP.GO_BACK"),
  SIGN_IN_FAILED_UNSIGNED_UP_WITH_SOCIAL: Symbol("SIGN_IN.FAILED_UNSIGNED_UP_WITH_SOCIAL"),

  EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN: Symbol("EMAIL_VERIFICATION.START_TO_VERIFY_TOKEN"),
  EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN: Symbol("EMAIL_VERIFICATION.FAILED_TO_VERIFY_TOKEN"),
  EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN: Symbol("EMAIL_VERIFICATION.SUCCEEDED_TO_VERIFY_TOKEN"),
  EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL: Symbol(
    "EMAIL_VERIFICATION.START_TO_RESEND_VERIFICATION_EMAIL",
  ),
  EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL: Symbol(
    "EMAIL_VERIFICATION.FAILED_TO_RESEND_VERIFICATION_EMAIL",
  ),
  EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL: Symbol(
    "EMAIL_VERIFICATION.SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL",
  ),

  AUTH_SUCCEEDED_TO_SIGN_OUT: Symbol("AUTH.SUCCEEDED_TO_SIGN_OUT"),
  AUTH_FAILED_TO_SIGN_OUT: Symbol("AUTH.FAILED_TO_SIGN_OUT"),

  AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: Symbol("AUTH.SUCCEEDED_TO_CHECK_LOGGED_IN"),
  AUTH_FAILED_TO_CHECK_LOGGED_IN: Symbol("AUTH.FAILED_TO_CHECK_LOGGED_IN"),

  HEADER_REACH_SCROLL_TOP: Symbol("HEADER.REACH_SCROLL_TOP"),
  HEADER_LEAVE_SCROLL_TOP: Symbol("HEADER.LEAVE_SCROLL_TOP"),

  ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: Symbol("ARTICLE_SEARCH.CHANGE_SEARCH_INPUT"),
  ARTICLE_SEARCH_CHANGE_SORTING: Symbol("ARTICLE_SEARCH.CHANGE_SORTING"),
  ARTICLE_SEARCH_START_TO_GET_PAPERS: Symbol("ARTICLE_SEARCH.START_TO_GET_PAPERS"),
  ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_PAPERS"),
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_PAPERS"),

  ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS: Symbol("ARTICLE_SEARCH.START_TO_GET_CITED_PAPERS"),
  ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_CITEDPAPERS"),
  ARTICLE_SEARCH_SUCCEEDED_TO_CITED_GET_PAPERS: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_CITED_PAPERS"),

  ARTICLE_SEARCH_CHANGE_COMMENT_INPUT: Symbol("ARTICLE_SEARCH.CHANGE_COMMENT_INPUT"),
  ARTICLE_SEARCH_TOGGLE_ABSTRACT: Symbol("ARTICLE_SEARCH.TOGGLE_ABSTRACT"),
  ARTICLE_SEARCH_TOGGLE_COMMENTS: Symbol("ARTICLE_SEARCH.TOGGLE_COMMENTS"),
  ARTICLE_SEARCH_TOGGLE_AUTHORS: Symbol("ARTICLE_SEARCH.TOGGLE_AUTHORS"),
  ARTICLE_SEARCH_VISIT_TITLE: Symbol("ARTICLE_SEARCH.VISIT_TITLE"),
  ARTICLE_SEARCH_START_TO_COMMENT_POST: Symbol("ARTICLE_SEARCH.START_TO_COMMENT_POST"),
  ARTICLE_SEARCH_SUCCEEDED_TO_COMMENT_POST: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_COMMENT_POST"),
  ARTICLE_SEARCH_FAILED_TO_COMMENT_POST: Symbol("ARTICLE_SEARCH.FAILED_TO_COMMENT_POST"),
  ARTICLE_SEARCH_CLOSE_FIRST_OPEN: Symbol("ARTICLE_SEARCH.CLOSE_FIRST_OPEN"),
  ARTICLE_SEARCH_START_TO_DELETE_COMMENT: Symbol("ARTICLE_SEARCH.START_TO_DELETE_COMMENT"),
  ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_DELETE_COMMENT"),
  ARTICLE_SEARCH_FAILED_TO_DELETE_COMMENT: Symbol("ARTICLE_SEARCH.FAILED_TO_DELETE_COMMENT"),
  ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS: Symbol("ARTICLE_SEARCH.START_TO_GET_MORE_COMMENTS"),
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_MORE_COMMENTS"),
  ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_MORE_COMMENTS"),
};
