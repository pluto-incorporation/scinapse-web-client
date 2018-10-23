import { ActionCreatorsMapObject } from "redux";
import { AppEntities } from "../reducers/entity";
import { CommonPaginationResponsePart } from "../api/types/common";
import { AvailableCitationType } from "../components/paperShow/records";
import { GetCollectionsResponse } from "../api/member";
import { GLOBAL_DIALOG_TYPE } from "../components/dialog/reducer";
import { Collection } from "../model/collection";

export enum ACTION_TYPES {
  GLOBAL_LOCATION_CHANGE,
  GLOBAL_SUCCEEDED_TO_INITIAL_DATA_FETCHING,
  GLOBAL_SUCCEEDED_TO_RENDER_AT_THE_CLIENT_SIDE,
  GLOBAL_CHANGE_DIALOG_TYPE,
  GLOBAL_ALERT_NOTIFICATION,
  GLOBAL_CLEAR_NOTIFICATION,

  GLOBAL_ADD_ENTITY,
  GLOBAL_FLUSH_ENTITIES,

  GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION,
  GLOBAL_SUCCEEDED_ADD_PAPER_TO_COLLECTION,
  GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION,
  GLOBAL_START_TO_REMOVE_PAPER_TO_COLLECTION,
  GLOBAL_SUCCEEDED_REMOVE_PAPER_TO_COLLECTION,
  GLOBAL_FAILED_TO_REMOVE_PAPER_TO_COLLECTION,

  GLOBAL_DIALOG_OPEN,
  GLOBAL_DIALOG_CLOSE,
  GLOBAL_DIALOG_START_TO_GET_COLLECTIONS,
  GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS,
  GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS,
  GLOBAL_DIALOG_START_TO_POST_COLLECTION,
  GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION,
  GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION,
  GLOBAL_DIALOG_START_TO_DELETE_COLLECTION,
  GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION,
  GLOBAL_DIALOG_FAILED_TO_DELETE_COLLECTION,
  GLOBAL_DIALOG_START_TO_UPDATE_COLLECTION,
  GLOBAL_DIALOG_SUCCEEDED_UPDATE_COLLECTION,
  GLOBAL_DIALOG_FAILED_TO_UPDATE_COLLECTION,
  GLOBAL_DIALOG_CLICK_CITATION_TAB,
  GLOBAL_DIALOG_START_TO_GET_CITATION_TEXT,
  GLOBAL_DIALOG_SUCCEEDED_GET_CITATION_TEXT,
  GLOBAL_DIALOG_FAILED_TO_GET_CITATION_TEXT,

  SET_DEVICE_TO_DESKTOP,
  SET_DEVICE_TO_TABLET,
  SET_DEVICE_TO_MOBILE,

  SIGN_IN_CHANGE_EMAIL_INPUT,
  SIGN_IN_CHANGE_PASSWORD_INPUT,
  SIGN_IN_ON_FOCUS_INPUT,
  SIGN_IN_ON_BLUR_INPUT,
  SIGN_IN_FORM_ERROR,
  SIGN_IN_START_TO_SIGN_IN,
  SIGN_IN_FAILED_TO_SIGN_IN,
  SIGN_IN_SUCCEEDED_TO_SIGN_IN,
  SIGN_IN_GET_AUTHORIZE_CODE,
  SIGN_IN_GO_BACK,

  SIGN_UP_CHANGE_EMAIL_INPUT,
  SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
  SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
  SIGN_UP_CHANGE_PASSWORD_INPUT,
  SIGN_UP_CHANGE_FIRST_NAME_INPUT,
  SIGN_UP_CHANGE_LASTNAME_INPUT,
  SIGN_UP_CHANGE_AFFILIATION_INPUT,
  SIGN_UP_FORM_ERROR,
  SIGN_UP_REMOVE_FORM_ERROR,
  SIGN_UP_ON_FOCUS_INPUT,
  SIGN_UP_ON_BLUR_INPUT,
  SIGN_UP_START_TO_CREATE_ACCOUNT,
  SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
  SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
  SIGN_UP_CHANGE_SIGN_UP_STEP,
  SIGN_UP_GET_AUTHORIZE_CODE,
  SIGN_UP_START_TO_EXCHANGE,
  SIGN_UP_FAILED_TO_EXCHANGE,
  SIGN_UP_SUCCEEDED_TO_EXCHANGE,
  SIGN_UP_GO_BACK,
  SIGN_IN_FAILED_DUE_TO_NOT_UNSIGNED_UP_WITH_SOCIAL,

  EMAIL_VERIFICATION_START_TO_VERIFY_TOKEN,
  EMAIL_VERIFICATION_FAILED_TO_VERIFY_TOKEN,
  EMAIL_VERIFICATION_SUCCEEDED_TO_VERIFY_TOKEN,
  EMAIL_VERIFICATION_START_TO_RESEND_VERIFICATION_EMAIL,
  EMAIL_VERIFICATION_FAILED_TO_RESEND_VERIFICATION_EMAIL,
  // tslint:disable-next-line:max-line-length
  EMAIL_VERIFICATION_SUCCEEDED_TO_RESEND_VERIFICATION_EMAIL,

  AUTH_SUCCEEDED_TO_SIGN_OUT,
  AUTH_FAILED_TO_SIGN_OUT,
  AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
  AUTH_FAILED_TO_CHECK_LOGGED_IN,

  HEADER_OPEN_KEYWORD_COMPLETION,
  HEADER_ClOSE_KEYWORD_COMPLETION,
  HEADER_START_TO_GET_KEYWORD_COMPLETION,
  HEADER_SUCCEEDED_TO_GET_KEYWORD_COMPLETION,
  HEADER_FAILED_TO_GET_KEYWORD_COMPLETION,
  HEADER_CLEAR_KEYWORD_COMPLETION,

  HOME_OPEN_KEYWORD_COMPLETION,
  HOME_ClOSE_KEYWORD_COMPLETION,
  HOME_START_TO_GET_KEYWORD_COMPLETION,
  HOME_SUCCEEDED_TO_GET_KEYWORD_COMPLETION,
  HOME_FAILED_TO_GET_KEYWORD_COMPLETION,
  HOME_CLEAR_KEYWORD_COMPLETION,

  PAPER_SHOW_TOGGLE_AUTHOR_BOX,
  PAPER_SHOW_CLEAR_PAPER_SHOW_STATE,
  PAPER_SHOW_START_TO_DELETE_COMMENT,
  PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT,
  PAPER_SHOW_FAILED_TO_DELETE_COMMENT,
  PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS,
  PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
  PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS,
  PAPER_SHOW_START_TO_GET_CITED_PAPERS,
  PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS,
  PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS,
  PAPER_SHOW_START_TO_GET_PAPER,
  PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
  PAPER_SHOW_FAILED_TO_GET_PAPER,
  PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS,
  PAPER_SHOW_START_TO_GET_COMMENTS,
  PAPER_SHOW_FAILED_TO_GET_COMMENTS,
  PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT,
  PAPER_SHOW_START_TO_POST_COMMENT,
  PAPER_SHOW_FAILED_TO_POST_COMMENT,
  PAPER_SHOW_START_TO_GET_RELATED_PAPERS,
  PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS,
  PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS,
  PAPER_SHOW_START_TO_GET_OTHER_PAPERS,
  PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS,
  PAPER_SHOW_FAILED_TO_GET_OTHER_PAPERS,
  PAPER_SHOW_START_TO_GET_COLLECTIONS,
  PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS,
  PAPER_SHOW_FAILED_TO_GET_COLLECTIONS,
  PAPER_SHOW_START_TO_POST_COLLECTION,
  PAPER_SHOW_SUCCEEDED_POST_COLLECTION,
  PAPER_SHOW_FAILED_TO_POST_COLLECTION,

  ARTICLE_SEARCH_TOGGLE_FILTER_BOX,
  ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
  ARTICLE_SEARCH_CHANGE_FILTER_RANGE_INPUT,
  ARTICLE_SEARCH_START_TO_GET_PAPERS,
  ARTICLE_SEARCH_FAILED_TO_GET_PAPERS,
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
  ARTICLE_SEARCH_TOGGLE_EXPANDING_FILTER_BOX,
  ARTICLE_SEARCH_START_TO_GET_SUGGESTION_KEYWORD,
  ARTICLE_SEARCH_FAILED_TO_GET_SUGGESTION_KEYWORD,
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_SUGGESTION_KEYWORD,
  ARTICLE_SEARCH_START_TO_GET_AGGREGATION_DATA,
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_AGGREGATION_DATA,
  ARTICLE_SEARCH_FAILED_TO_GET_AGGREGATION_DATA,
  ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS,
  ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS,
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS,
  ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS,
  ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS,
  ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
  ARTICLE_SEARCH_SAVE_LAST_SUCCEEDED_PARAMS,

  AUTHOR_SHOW_START_TO_LOAD_DATA_FOR_PAGE,
  AUTHOR_SHOW_FINISH_TO_LOAD_DATA_FOR_PAGE,
  AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR,
  AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS,
  AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS,

  COLLECTIONS_START_TO_GET_COLLECTIONS,
  COLLECTIONS_SUCCEEDED_GET_COLLECTIONS,
  COLLECTIONS_FAILED_TO_GET_COLLECTIONS,
  COLLECTIONS_START_TO_GET_MEMBER,
  COLLECTIONS_SUCCEEDED_GET_MEMBER,
  COLLECTIONS_FAILED_TO_GET_MEMBER,

  COLLECTION_SHOW_START_TO_GET_COLLECTION,
  COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION,
  COLLECTION_SHOW_FAILED_TO_GET_COLLECTION,
  COLLECTION_SHOW_START_TO_GET_PAPERS,
  COLLECTION_SHOW_SUCCEEDED_GET_PAPERS,
  COLLECTION_SHOW_FAILED_TO_GET_PAPERS,

  JOURNAL_SHOW_START_TO_GET_JOURNAL,
  JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL,
  JOURNAL_SHOW_FAILED_TO_GET_JOURNAL,
  JOURNAL_SHOW_START_TO_GET_PAPERS,
  JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS,
  JOURNAL_SHOW_FAILED_TO_GET_PAPERS,

  PROFILE_COMMON_START_TO_GET_PROFILE,
  PROFILE_COMMON_SUCCEEDED_TO_GET_PROFILE,
  PROFILE_COMMON_FAILED_TO_GET_PROFILE,
  PROFILE_COMMON_START_TO_GET_PROFILE_PUBLICATIONS,
  PROFILE_COMMON_SUCCEEDED_TO_GET_PROFILE_PUBLICATIONS,
  PROFILE_COMMON_FAILED_TO_GET_PROFILE_PUBLICATIONS,
  PROFILE_NEW_START_TO_POST_PROFILE,
  PROFILE_NEW_SUCCEEDED_TO_POST_PROFILE,
  PROFILE_NEW_FAILED_TO_POST_PROFILE,
}

export function createAction<T extends { type: ACTION_TYPES }>(d: T): T {
  return d;
}

interface GetMultiPapers extends CommonPaginationResponsePart {
  paperIds: number[];
}

interface GetMultiComments extends CommonPaginationResponsePart {
  commentIds: number[];
}

export const ActionCreators = {
  changeGlobalDialog(payload: { type: GLOBAL_DIALOG_TYPE }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_CHANGE_DIALOG_TYPE,
      payload,
    });
  },

  openGlobalDialog(payload: {
    type: GLOBAL_DIALOG_TYPE;
    collectionDialogTargetPaperId?: number;
    citationDialogTargetPaperId?: number;
    collection?: Collection;
  }) {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_OPEN, payload });
  },

  closeGlobalDialog() {
    return createAction({ type: ACTION_TYPES.GLOBAL_DIALOG_CLOSE });
  },

  startToLoadAuthorShowPageData() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_START_TO_LOAD_DATA_FOR_PAGE });
  },

  finishToLoadAuthorShowPageData() {
    return createAction({ type: ACTION_TYPES.AUTHOR_SHOW_FINISH_TO_LOAD_DATA_FOR_PAGE });
  },

  getCoAuthors(payload: { coAuthorIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_CO_AUTHORS,
      payload,
    });
  },

  getAuthor(payload: { authorId: number }) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_GET_AUTHOR,
      payload,
    });
  },

  getAuthorPapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_GET_PAPERS,
      payload,
    });
  },

  startToGetPaper() {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_PAPER });
  },

  failedToGetPaper() {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_PAPER });
  },

  getPaper(payload: { paperId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_PAPER,
      payload,
    });
  },

  getRelatedPapers(payload: { paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_RELATED_PAPERS,
      payload,
    });
  },

  getOtherPapersFromAuthor(payload: { paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_OTHER_PAPERS,
      payload,
    });
  },

  getReferencePapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
      payload,
    });
  },

  getCitedPapers(payload: GetMultiPapers) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_CITED_PAPERS,
      payload,
    });
  },

  startToGetComments() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COMMENTS,
    });
  },

  failedToGetComments() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COMMENTS,
    });
  },

  getComments(payload: GetMultiComments) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_GET_COMMENTS,
      payload,
    });
  },

  postComment(payload: { commentId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_POST_COMMENT,
      payload,
    });
  },

  startToPostComment() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COMMENT,
    });
  },

  failedToPostComment(payload: { paperId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COMMENT,
      payload,
    });
  },

  startToDeleteComment() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_DELETE_COMMENT,
    });
  },

  handleClickCitationTab(payload: { tab: AvailableCitationType }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_CLICK_CITATION_TAB,
      payload,
    });
  },

  startToGetCitationText() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_CITATION_TEXT,
    });
  },

  succeededToGetCitationText(payload: { citationText: string }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_CITATION_TEXT,
      payload,
    });
  },

  failedToGetCitationText() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_CITATION_TEXT,
    });
  },

  toggleAuthorBox() {
    return createAction({ type: ACTION_TYPES.PAPER_SHOW_TOGGLE_AUTHOR_BOX });
  },

  succeededToDeleteComment(payload: { commentId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_TO_DELETE_COMMENT,
      payload,
    });
  },

  failedToDeleteComment() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_DELETE_COMMENT,
    });
  },

  startToGetReferencePapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_REFERENCE_PAPERS,
    });
  },

  failedToGetReferencePapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_REFERENCE_PAPERS,
    });
  },

  startToGetCitedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_CITED_PAPERS,
    });
  },

  failedToGetCitedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_CITED_PAPERS,
    });
  },

  startToGetRelatedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_RELATED_PAPERS,
    });
  },

  failedToGetRelatedPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_RELATED_PAPERS,
    });
  },

  startToGetAuthorOtherPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_OTHER_PAPERS,
    });
  },

  failedToGetAuthorOtherPapers() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_OTHER_PAPERS,
    });
  },

  startToGetCollectionInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_COLLECTION,
    });
  },

  succeededToGetCollectionInCollectionShow(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION,
      payload,
    });
  },

  failedToGetCollectionInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_COLLECTION,
    });
  },

  startToGetCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_GET_COLLECTIONS,
    });
  },

  succeededToGetCollectionsInGlobalDialog(payload: { collectionIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_GET_COLLECTIONS,
      payload,
    });
  },

  failedToGetCollectionsInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_GET_COLLECTIONS,
    });
  },

  startToPostCollectionInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_POST_COLLECTION,
    });
  },

  succeededToPostCollectionInGlobalDialog(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_POST_COLLECTION,
      payload,
    });
  },

  failedToPostCollectionInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_POST_COLLECTION,
    });
  },

  startToAddPaperToCollectionInGlobalDialog(payload: { collection: Collection }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION,
      payload,
    });
  },

  succeededToAddPaperToCollectionInGlobalDialog() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_ADD_PAPER_TO_COLLECTION,
    });
  },

  failedToAddPaperToCollectionInGlobalDialog(payload: { collection: Collection }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION,
      payload,
    });
  },

  startToRemovePaperToCollection(payload: { collection: Collection }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_START_TO_REMOVE_PAPER_TO_COLLECTION,
      payload,
    });
  },

  succeededToRemovePaperToCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_SUCCEEDED_REMOVE_PAPER_TO_COLLECTION,
    });
  },

  failedToRemovePaperToCollection(payload: { collection: Collection }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_PAPER_TO_COLLECTION,
      payload,
    });
  },

  startToGetCollectionsInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_GET_COLLECTIONS,
    });
  },

  succeededToGetCollectionsInPaperShow(payload: { collectionIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_GET_COLLECTIONS,
      payload,
    });
  },

  failedToGetCollectionsInPaperShow() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_GET_COLLECTIONS,
    });
  },

  startToPostCollectionInCollectionDropdown() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_START_TO_POST_COLLECTION,
    });
  },

  succeededToPostCollectionInCollectionDropdown(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_COLLECTION,
      payload,
    });
  },

  failedToPostCollectionInCollectionDropdown() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_FAILED_TO_POST_COLLECTION,
    });
  },

  startToGetCollectionsInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_START_TO_GET_COLLECTIONS,
    });
  },

  succeededToGetCollectionsInCollectionsPage(payload: GetCollectionsResponse) {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_COLLECTIONS,
      payload,
    });
  },

  failedToGetCollectionsInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_COLLECTIONS,
    });
  },

  startToGetMemberInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_START_TO_GET_MEMBER,
    });
  },

  succeededToGetMemberInCollectionsPage(payload: { memberId: number }) {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_SUCCEEDED_GET_MEMBER,
      payload,
    });
  },

  failedToGetMemberInCollectionsPage() {
    return createAction({
      type: ACTION_TYPES.COLLECTIONS_FAILED_TO_GET_MEMBER,
    });
  },

  startToGetPapersInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_PAPERS,
    });
  },

  succeededToGetPapersInCollectionShow(payload: { paperIds: number[] }) {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_PAPERS,
      payload,
    });
  },

  startToDeleteCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_DELETE_COLLECTION,
    });
  },

  succeededToDeleteCollection(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION,
      payload,
    });
  },

  failedToDeleteCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_DELETE_COLLECTION,
    });
  },

  startToUpdateCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_START_TO_UPDATE_COLLECTION,
    });
  },

  succeededToUpdateCollection(payload: { collectionId: number }) {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_UPDATE_COLLECTION,
      payload,
    });
  },

  failedToUpdateCollection() {
    return createAction({
      type: ACTION_TYPES.GLOBAL_DIALOG_FAILED_TO_UPDATE_COLLECTION,
    });
  },

  startToGetJournal() {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_JOURNAL,
    });
  },

  succeededToGetJournal(payload: { journalId: number }) {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_JOURNAL,
      payload,
    });
  },

  failedToGetJournal() {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_JOURNAL,
    });
  },

  startToGetJournalPapers() {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_START_TO_GET_PAPERS,
    });
  },

  succeededToGetJournalPapers(payload: {
    paperIds: number[];
    totalPage: number;
    currentPage: number;
    paperCount: number;
    filteredPaperCount: number;
  }) {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_SUCCEEDED_TO_GET_PAPERS,
      payload,
    });
  },

  failedToGetJournalPapers() {
    return createAction({
      type: ACTION_TYPES.JOURNAL_SHOW_FAILED_TO_GET_PAPERS,
    });
  },

  failedToGetPapersInCollectionShow() {
    return createAction({
      type: ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_PAPERS,
    });
  },

  clearPaperShowState() {
    return createAction({
      type: ACTION_TYPES.PAPER_SHOW_CLEAR_PAPER_SHOW_STATE,
    });
  },

  startToGetProfile() {
    return createAction({
      type: ACTION_TYPES.PROFILE_COMMON_START_TO_GET_PROFILE,
    });
  },

  succeededToGetProfile(payload: { profileId: string }) {
    return createAction({
      type: ACTION_TYPES.PROFILE_COMMON_SUCCEEDED_TO_GET_PROFILE,
      payload,
    });
  },

  failedToGetProfile() {
    return createAction({
      type: ACTION_TYPES.PROFILE_COMMON_FAILED_TO_GET_PROFILE,
    });
  },

  startToGetProfilePublications() {
    return createAction({
      type: ACTION_TYPES.PROFILE_COMMON_START_TO_GET_PROFILE_PUBLICATIONS,
    });
  },

  succeededToGetProfilePublications(payload: {
    paperIds: number[];
    page: number;
    numberOfPapers: number;
    totalPages: number;
  }) {
    return createAction({
      type: ACTION_TYPES.PROFILE_COMMON_SUCCEEDED_TO_GET_PROFILE_PUBLICATIONS,
      payload,
    });
  },

  failedToGetProfilePublications() {
    return createAction({
      type: ACTION_TYPES.PROFILE_COMMON_FAILED_TO_GET_PROFILE_PUBLICATIONS,
    });
  },

  startToPostProfile() {
    return createAction({
      type: ACTION_TYPES.PROFILE_NEW_START_TO_POST_PROFILE,
    });
  },

  succeededToPostProfile(payload: { profileId: string }) {
    return createAction({
      type: ACTION_TYPES.PROFILE_NEW_SUCCEEDED_TO_POST_PROFILE,
      payload,
    });
  },

  failedToPostProfile() {
    return createAction({
      type: ACTION_TYPES.PROFILE_NEW_FAILED_TO_POST_PROFILE,
    });
  },

  addEntity(payload: { entities: { [K in keyof AppEntities]?: AppEntities[K] }; result: number | number[] }) {
    return createAction({ type: ACTION_TYPES.GLOBAL_ADD_ENTITY, payload });
  },

  flushEntities() {
    return createAction({ type: ACTION_TYPES.GLOBAL_FLUSH_ENTITIES });
  },

  globalLocationChange() {
    return createAction({ type: ACTION_TYPES.GLOBAL_LOCATION_CHANGE });
  },
};

export type ActionUnion<T extends ActionCreatorsMapObject> = ReturnType<T[keyof T]>;

export type Actions = ActionUnion<typeof ActionCreators>;
