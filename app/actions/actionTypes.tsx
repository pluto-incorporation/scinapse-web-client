export const ACTION_TYPES = {
  GLOBAL_LOCATION_CHANGE: "@@router/LOCATION_CHANGE",
  GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING: Symbol("GLOBAL.SUCCEEDED_TO_INITIAL_DATA_FETCHING"),
  GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE: Symbol("GLOBAL.SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE"),
  GLOBAL_DIALOG_OPEN: Symbol("GLOBAL_DIALOG_OPEN"),
  GLOBAL_DIALOG_CLOSE: Symbol("GLOBAL_DIALOG_CLOSE"),
  GLOBAL_CHANGE_DIALOG_TYPE: Symbol("GLOBAL_CHANGE_DIALOG_TYPE"),
  GLOBAL_ALERT_NOTIFICATION: Symbol("GLOBAL_ALERT_NOTIFICATION"),
  GLOBAL_CLEAR_NOTIFICATION: Symbol("GLOBAL_CLEAR_NOTIFICATION"),

  GLOBAL_SET_USER_DROPDOWN_ANCHOR_ELEMENT: Symbol("GLOBAL.SET_USER_DROPDOWN_ANCHOR_ELEMENT"),
  GLOBAL_TOGGLE_USER_DROPDOWN: Symbol("GLOBAL.TOGGLE_USER_DROPDOWN"),
  GLOBAL_CLOSE_USER_DROPDOWN: Symbol("GLOBAL.CLOSE_USER_DROPDOWN"),

  GLOBAL_START_TO_REMOVE_BOOKMARK: Symbol("GLOBAL.START_TO_REMOVE_BOOKMARK"),
  GLOBAL_SUCCEEDED_REMOVE_BOOKMARK: Symbol("GLOBAL.SUCCEEDED_REMOVE_BOOKMARK"),
  GLOBAL_FAILED_TO_REMOVE_BOOKMARK: Symbol("GLOBAL.FAILED_TO_REMOVE_BOOKMARK"),

  GLOBAL_START_TO_POST_BOOKMARK: Symbol("GLOBAL.START_TO_POST_BOOKMARK"),
  GLOBAL_SUCCEEDED_POST_BOOKMARK: Symbol("GLOBAL.SUCCEEDED_POST_BOOKMARK"),
  GLOBAL_FAILED_TO_POST_BOOKMARK: Symbol("GLOBAL.FAILED_TO_POST_BOOKMARK"),

  GLOBAL_START_TO_CHECK_BOOKMARKED_STATUS: Symbol("GLOBAL.START_TO_CHECK_BOOKMARKED_STATUS"),
  GLOBAL_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS: Symbol("GLOBAL.SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS"),
  GLOBAL_FAILED_TO_CHECK_BOOKMARKED_STATUS: Symbol("GLOBAL.FAILED_TO_CHECK_BOOKMARKED_STATUS"),

  GLOBAL_START_TO_GET_BOOKMARK: Symbol("GLOBAL.START_TO_GET_BOOKMARK"),
  GLOBAL_FAILED_TO_GET_BOOKMARK: Symbol("GLOBAL.FAILED_TO_GET_BOOKMARK"),
  GLOBAL_SUCCEEDED_TO_GET_BOOKMARK: Symbol("GLOBAL.SUCCEEDED_TO_GET_BOOKMARK"),

  SET_DEVICE_TO_DESKTOP: Symbol("SET_DEVICE_TO_DESKTOP"),
  SET_DEVICE_TO_MOBILE: Symbol("SET_DEVICE_TO_MOBILE"),

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
  SIGN_UP_GO_BACK: Symbol("SIGN_UP.GO_BACK"),
  SIGN_IN_FAILED_DUE_TO_NOT_UNSIGNED_UP_WITH_SOCIAL: Symbol(
    "SIGN_IN.SIGN_IN_FAILED_DUE_TO_NOT_UNSIGNED_UP_WITH_SOCIAL",
  ),

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

  HEADER_OPEN_KEYWORD_COMPLETION: Symbol("HEADER.OPEN_KEYWORD_COMPLETION"),
  HEADER_ClOSE_KEYWORD_COMPLETION: Symbol("HEADER.CLOSE_KEYWORD_COMPLETION"),

  HEADER_START_TO_GET_KEYWORD_COMPLETION: Symbol("HEADER.START_TO_GET_KEYWORD_COMPLETION"),
  HEADER_SUCCEEDED_TO_GET_KEYWORD_COMPLETION: Symbol("HEADER.SUCCEEDED_TO_GET_KEYWORD_COMPLETION"),
  HEADER_FAILED_TO_GET_KEYWORD_COMPLETION: Symbol("HEADER.FAILED_TO_GET_KEYWORD_COMPLETION"),
  HEADER_CLEAR_KEYWORD_COMPLETION: Symbol("HEADER.CLEAR_KEYWORD_COMPLETION"),

  HOME_OPEN_KEYWORD_COMPLETION: Symbol("HOME.OPEN_KEYWORD_COMPLETION"),
  HOME_ClOSE_KEYWORD_COMPLETION: Symbol("HOME.CLOSE_KEYWORD_COMPLETION"),

  HOME_START_TO_GET_KEYWORD_COMPLETION: Symbol("HOME.START_TO_GET_KEYWORD_COMPLETION"),
  HOME_SUCCEEDED_TO_GET_KEYWORD_COMPLETION: Symbol("HOME.SUCCEEDED_TO_GET_KEYWORD_COMPLETION"),
  HOME_FAILED_TO_GET_KEYWORD_COMPLETION: Symbol("HOME.FAILED_TO_GET_KEYWORD_COMPLETION"),
  HOME_CLEAR_KEYWORD_COMPLETION: Symbol("HOME.CLEAR_KEYWORD_COMPLETION"),

  PAPER_SHOW_TOGGLE_AUTHOR_BOX: Symbol("PAPER_SHOW.TOGGLE_AUTHOR_BOX"),

  PAPER_SHOW_START_TO_GET_CITATION_TEXT: Symbol("PAPER_SHOW.START_TO_GET_CITATION_TEXT"),
  PAPER_SHOW_SUCCEEDED_GET_CITATION_TEXT: Symbol("PAPER_SHOW.SUCCEEDED_GET_CITATION_TEXT"),
  PAPER_SHOW_FAILED_TO_GET_CITATION_TEXT: Symbol("PAPER_SHOW.FAILED_TO_GET_CITATION_TEXT"),

  PAPER_SHOW_TOGGLE_CITATION_DIALOG: Symbol("PAPER_SHOW.TOGGLE_CITATION_DIALOG"),
  PAPER_SHOW_CLICK_CITATION_TAB: Symbol("PAPER_SHOW.CLICK_CITATION_TAB"),

  PAPER_SHOW_START_TO_DELETE_COMMENT: Symbol("PAPER_SHOW.START_TO_DELETE_COMMENT"),
  PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT: Symbol("PAPER_SHOW.SUCCEEDED_TO_DELETE_COMMENT"),
  PAPER_SHOW_FAILED_TO_DELETE_COMMENT: Symbol("PAPER_SHOW.PAPER_SHOW_FAILED_TO_DELETE_COMMENT"),

  PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS: Symbol("PAPER_SHOW.START_TO_GET_REFERENCE_PAPERS"),
  PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS: Symbol("PAPER_SHOW.SUCCEEDED_TO_GET_REFERENCE_PAPERS"),
  PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS: Symbol("PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS"),

  PAPER_SHOW_START_TO_GET_CITED_PAPERS: Symbol("PAPER_SHOW.START_TO_GET_CITED_PAPERS"),
  PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS: Symbol("PAPER_SHOW.SUCCEEDED_TO_GET_CITED_PAPERS"),
  PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS: Symbol("PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS"),

  PAPER_SHOW_START_TO_GET_PAPER: Symbol("PAPER_SHOW.START_TO_GET_PAPER"),
  PAPER_SHOW_SUCCEEDED_TO_GET_PAPER: Symbol("PAPER_SHOW.SUCCEEDED_TO_GET_PAPER"),
  PAPER_SHOW_FAILED_TO_GET_PAPER: Symbol("PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_PAPER"),
  PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS: Symbol("PAPER_SHOW.SUCCEEDED_TO_GET_COMMENTS"),
  PAPER_SHOW_START_TO_GET_COMMENTS: Symbol("PAPER_SHOW.START_TO_GET_COMMENTS"),
  PAPER_SHOW_FAILED_TO_GET_COMMENTS: Symbol("PAPER_SHOW.PAPER_SHOW_FAILED_TO_GET_COMMENTS"),
  PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT: Symbol("PAPER_SHOW.SUCCEEDED_TO_POST_COMMENT"),
  PAPER_SHOW_START_TO_POST_COMMENT: Symbol("PAPER_SHOW.START_TO_POST_COMMENT"),
  PAPER_SHOW_FAILED_TO_POST_COMMENT: Symbol("PAPER_SHOW.PAPER_SHOW_FAILED_TO_POST_COMMENT"),
  PAPER_SHOW_CHANGE_COMMENT_INPUT: Symbol("PAPER_SHOW.CHANGE_COMMENT_INPUT"),
  PAPER_SHOW_TOGGLE_ABSTRACT: Symbol("PAPER_SHOW.TOGGLE_ABSTRACT"),
  PAPER_SHOW_TOGGLE_AUTHORS: Symbol("PAPER_SHOW.TOGGLE_AUTHORS"),
  PAPER_SHOW_VISIT_TITLE: Symbol("PAPER_SHOW.VISIT_TITLE"),
  PAPER_SHOW_CLOSE_FIRST_OPEN: Symbol("PAPER_SHOW.CLOSE_FIRST_OPEN"),
  PAPER_SHOW_CLEAR_PAPER_SHOW_STATE: Symbol("PAPER_SHOW.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE"),

  PAPER_SHOW_START_TO_CHECK_BOOKMARKED_STATUS: Symbol("PAPER_SHOW.START_TO_CHECK_BOOKMARKED_STATUS"),
  PAPER_SHOW_SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS: Symbol("PAPER_SHOW.SUCCEEDED_TO_CHECK_BOOKMARKED_STATUS"),
  PAPER_SHOW_FAILED_TO_CHECK_BOOKMARKED_STATUS: Symbol("PAPER_SHOW.FAILED_TO_CHECK_BOOKMARKED_STATUS"),

  PAPER_SHOW_START_TO_GET_RELATED_PAPERS: Symbol("PAPER_SHOW.START_TO_GET_RELATED_PAPERS"),
  PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS: Symbol("PAPER_SHOW.SUCCEEDED_TO_GET_RELATED_PAPERS"),
  PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS: Symbol("PAPER_SHOW.FAILED_TO_GET_RELATED_PAPERS"),

  PAPER_SHOW_START_TO_GET_OTHER_PAPERS: Symbol("PAPER_SHOW.START_TO_GET_OTHER_PAPERS"),
  PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS: Symbol("PAPER_SHOW.SUCCEEDED_TO_GET_OTHER_PAPERS"),
  PAPER_SHOW_FAILED_TO_GET_OTHER_PAPERS: Symbol("PAPER_SHOW.FAILED_TO_GET_OTHER_PAPERS"),

  ARTICLE_SEARCH_TOGGLE_FILTER_BOX: Symbol("ARTICLE_SEARCH.TOGGLE_FILTER_BOX"),
  ARTICLE_SEARCH_CHANGE_SEARCH_INPUT: Symbol("ARTICLE_SEARCH.CHANGE_SEARCH_INPUT"),
  ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT: Symbol("ARTICLE_SEARCH.CHANGE_FILTER_RANGE_INPUT"),
  ARTICLE_SEARCH_CHANGE_SORTING: Symbol("ARTICLE_SEARCH.CHANGE_SORTING"),
  ARTICLE_SEARCH_START_TO_GET_PAPERS: Symbol("ARTICLE_SEARCH.START_TO_GET_PAPERS"),
  ARTICLE_SEARCH_FAILED_TO_GET_PAPERS: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_PAPERS"),
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_PAPERS"),
  ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX: Symbol("ARTICLE_SEARCH.TOGGLE_EXPANDING_FILTER_BOX"),

  ARTICLE_SEARCH_SET_ACTIVE_CITATION_DIALOG_PAPER_ID: Symbol("ARTICLE_SEARCH.SET_ACTIVE_CITATION_DIALOG_PAPER_ID"),
  ARTICLE_SEARCH_TOGGLE_CITATION_DIALOG: Symbol("ARTICLE_SEARCH.TOGGLE_CITATION_DIALOG"),
  ARTICLE_SEARCH_CLICK_CITATION_TAB: Symbol("ARTICLE_SEARCH.CLICK_CITATION_TAB"),
  ARTICLE_SEARCH_START_TO_GET_CITATION_TEXT: Symbol("ARTICLE_SEARCH.START_TO_GET_CITATION_TEXT"),
  ARTICLE_SEARCH_SUCCEEDED_GET_CITATION_TEXT: Symbol("ARTICLE_SEARCH.SUCCEEDED_GET_CITATION_TEXT"),
  ARTICLE_SEARCH_FAILED_TO_GET_CITATION_TEXT: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_CITATION_TEXT"),

  ARTICLE_SEARCH_START_TO_GET_AGGREGATION_DATA: Symbol("ARTICLE_SEARCH.START_TO_GET_AGGREGATION_DATA"),
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_AGGREGATION_DATA: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_AGGREGATION_DATA"),
  ARTICLE_SEARCH_FAILED_TO_GET_AGGREGATION_DATA: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_AGGREGATION_DATA"),

  ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS: Symbol("ARTICLE_SEARCH.START_TO_GET_CITED_PAPERS"),
  ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_CITED_PAPERS"),
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_CITED_PAPERS"),

  ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS: Symbol("ARTICLE_SEARCH.START_TO_GET_REFERENCE_PAPERS"),
  ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_REFERENCE_PAPERS"),
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_REFERENCE_PAPERS"),

  ARTICLE_SEARCH_CHANGE_COMMENT_INPUT: Symbol("ARTICLE_SEARCH.CHANGE_COMMENT_INPUT"),
  ARTICLE_SEARCH_TOGGLE_ABSTRACT: Symbol("ARTICLE_SEARCH.TOGGLE_ABSTRACT"),
  ARTICLE_SEARCH_TOGGLE_COMMENTS: Symbol("ARTICLE_SEARCH.TOGGLE_COMMENTS"),
  ARTICLE_SEARCH_TOGGLE_AUTHORS: Symbol("ARTICLE_SEARCH.TOGGLE_AUTHORS"),
  ARTICLE_SEARCH_VISIT_TITLE: Symbol("ARTICLE_SEARCH.VISIT_TITLE"),
  ARTICLE_SEARCH_START_TO_POST_COMMENT: Symbol("ARTICLE_SEARCH.START_TO_POST_COMMENT"),
  ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_POST_COMMENT"),
  ARTICLE_SEARCH_FAILED_TO_POST_COMMENT: Symbol("ARTICLE_SEARCH.FAILED_TO_POST_COMMENT"),
  ARTICLE_SEARCH_CLOSE_FIRST_OPEN: Symbol("ARTICLE_SEARCH.CLOSE_FIRST_OPEN"),
  ARTICLE_SEARCH_START_TO_DELETE_COMMENT: Symbol("ARTICLE_SEARCH.START_TO_DELETE_COMMENT"),
  ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_DELETE_COMMENT"),
  ARTICLE_SEARCH_FAILED_TO_DELETE_COMMENT: Symbol("ARTICLE_SEARCH.FAILED_TO_DELETE_COMMENT"),
  ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS: Symbol("ARTICLE_SEARCH.START_TO_GET_MORE_COMMENTS"),
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS: Symbol("ARTICLE_SEARCH.SUCCEEDED_TO_GET_MORE_COMMENTS"),
  ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS: Symbol("ARTICLE_SEARCH.FAILED_TO_GET_MORE_COMMENTS"),

  BOOKMARK_PAGE_CLEAR_BOOkMARK_PAGE_STATE: Symbol("BOOKMARK_PAGE.CLEAR_BOOkMARK_PAGE_STATE"),
  BOOKMARK_PAGE_SET_ACTIVE_CITATION_DIALOG_PAPER_ID: Symbol("BOOKMARK_PAGE.SET_ACTIVE_CITATION_DIALOG_PAPER_ID"),
  BOOKMARK_PAGE_TOGGLE_CITATION_DIALOG: Symbol("BOOKMARK_PAGE.TOGGLE_CITATION_DIALOG"),
  BOOKMARK_PAGE_TOGGLE_ABSTRACT: Symbol("BOOKMARK_PAGE.TOGGLE_ABSTRACT"),
  BOOKMARK_PAGE_TOGGLE_AUTHORS: Symbol("BOOKMARK_PAGE.TOGGLE_AUTHORS"),
  BOOKMARK_PAGE_VISIT_TITLE: Symbol("BOOKMARK_PAGE.VISIT_TITLE"),
  BOOKMARK_PAGE_CLOSE_FIRST_OPEN: Symbol("BOOKMARK_PAGE.CLOSE_FIRST_OPEN"),
  BOOKMARK_PAGE_CLICK_CITATION_TAB: Symbol("BOOKMARK_PAGE.CLICK_CITATION_TAB"),
  BOOKMARK_PAGE_START_TO_GET_CITATION_TEXT: Symbol("BOOKMARK_PAGE.START_TO_GET_CITATION_TEXT"),
  BOOKMARK_PAGE_SUCCEEDED_GET_CITATION_TEXT: Symbol("BOOKMARK_PAGE.SUCCEEDED_GET_CITATION_TEXT"),
  BOOKMARK_PAGE_FAILED_TO_GET_CITATION_TEXT: Symbol("BOOKMARK_PAGE.FAILED_TO_GET_CITATION_TEXT"),
};
