import * as Redux from 'redux';
import * as ConfigurationReducer from './configuration';
import * as currentUserReducer from './currentUser';
import { CURRENT_USER_INITIAL_STATE } from '../model/currentUser';
import * as dialogReducer from '../components/dialog/reducer';
import LayoutReducer, { LAYOUT_INITIAL_STATE } from '../components/layouts/reducer';
import SignUpModalReducer, { SIGN_UP_MODAL_INITIAL_STATE } from './signUpModal';
import * as articleSearchReducer from '../components/articleSearch/reducer';
import * as authorSearchReducer from '../containers/authorSearch/reducer';
import { ARTICLE_SEARCH_INITIAL_STATE } from '../components/articleSearch/records';
import * as emailVerificationReducer from '../components/auth/emailVerification/reducer';
import { PAPER_SHOW_INITIAL_STATE } from '../containers/paperShow/records';
import { reducer as paperShowReducer } from '../containers/paperShow/reducer';
import { reducer as AuthorShowReducer, AUTHOR_SHOW_INITIAL_STATE } from '../containers/unconnectedAuthorShow/reducer';
import { reducer as EntityReducer, INITIAL_ENTITY_STATE } from './entity';
import {
  reducer as MyCollectionsReducer,
  MY_COLLECTIONS_INITIAL_STATE,
} from '../containers/paperShowCollectionControlButton/reducer';
import { reducer as CollectionShowReducer, INITIAL_COLLECTION_SHOW_STATE } from '../containers/collectionShow/reducer';
import { reducer as UserCollectionsReducer, USER_COLLECTIONS_INITIAL_STATE } from '../components/collections/reducer';
import { reducer as JournalShowReducer, JOURNAL_SHOW_INITIAL_STATE } from '../components/journalShow/reducer';
import {
  reducer as ConnectedAuthorShowReducer,
  CONNECTED_AUTHOR_SHOW_INITIAL_STATE,
} from '../containers/connectedAuthorShow/reducer';
import { AUTHOR_SEARCH_INITIAL_STATE } from '../containers/authorSearch/records';
import { RELATED_PAPERS_INITIAL_STATE, reducer as RelatedPapersReducer } from './realtedPapers';
import { reducer as PDFViewerReducer, PDF_VIEWER_INITIAL_STATE } from './pdfViewer';
import SearchQueryReducer, { SEARCH_QUERY_INITIAL_STATE } from './searchQuery';
import { reducer as SearchFilterReducer, SEARCH_FILTER_INITIAL_STATE } from './searchFilter';
import RequestPreprintDialogReducer, { REQUEST_PREPRINT_DIALOG_INITIAL_STATE } from './requestPreprintDialog';
import KeywordSettingsReducer, { KEYWORD_SETTINGS_INITIAL_STATE } from './keywordSettings';
import CreateKeywordAlertDialogReducer, { CREATE_KEYWORD_ALERT_DIALOG_INITIAL_STATE } from './createKeywordAlertDialog';
import ScinapseSnackbarReducer, { SCINAPSE_SNACK_BAR_INITIAL_STATE } from './scinapseSnackbar';

export type AppState = typeof initialState;

export const initialState = {
  configuration: ConfigurationReducer.CONFIGURATION_INITIAL_STATE,
  dialog: dialogReducer.DIALOG_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  emailVerification: emailVerificationReducer.EMAIL_VERIFICATION_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  authorSearch: AUTHOR_SEARCH_INITIAL_STATE,
  paperShow: PAPER_SHOW_INITIAL_STATE,
  authorShow: AUTHOR_SHOW_INITIAL_STATE,
  connectedAuthorShow: CONNECTED_AUTHOR_SHOW_INITIAL_STATE,
  journalShow: JOURNAL_SHOW_INITIAL_STATE,
  collectionShow: INITIAL_COLLECTION_SHOW_STATE,
  myCollections: MY_COLLECTIONS_INITIAL_STATE,
  userCollections: USER_COLLECTIONS_INITIAL_STATE,
  relatedPapersState: RELATED_PAPERS_INITIAL_STATE,
  PDFViewerState: PDF_VIEWER_INITIAL_STATE,
  searchQueryState: SEARCH_QUERY_INITIAL_STATE,
  searchFilterState: SEARCH_FILTER_INITIAL_STATE,
  signUpModalState: SIGN_UP_MODAL_INITIAL_STATE,
  requestPreprintDialogState: REQUEST_PREPRINT_DIALOG_INITIAL_STATE,
  keywordSettingsState: KEYWORD_SETTINGS_INITIAL_STATE,
  createKeywordAlertDialogState: CREATE_KEYWORD_ALERT_DIALOG_INITIAL_STATE,
  scinapseSnackbarState: SCINAPSE_SNACK_BAR_INITIAL_STATE,
  entities: INITIAL_ENTITY_STATE,
};

export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
  configuration: ConfigurationReducer.reducer,
  dialog: dialogReducer.reducer,
  layout: LayoutReducer,
  articleSearch: articleSearchReducer.reducer,
  authorSearch: authorSearchReducer.reducer,
  emailVerification: emailVerificationReducer.reducer,
  paperShow: paperShowReducer,
  authorShow: AuthorShowReducer,
  connectedAuthorShow: ConnectedAuthorShowReducer,
  journalShow: JournalShowReducer,
  currentUser: currentUserReducer.reducer,
  collectionShow: CollectionShowReducer,
  myCollections: MyCollectionsReducer,
  userCollections: UserCollectionsReducer,
  relatedPapersState: RelatedPapersReducer,
  PDFViewerState: PDFViewerReducer,
  searchQueryState: SearchQueryReducer,
  searchFilterState: SearchFilterReducer,
  signUpModalState: SignUpModalReducer,
  requestPreprintDialogState: RequestPreprintDialogReducer,
  keywordSettingsState: KeywordSettingsReducer,
  createKeywordAlertDialogState: CreateKeywordAlertDialogReducer,
  scinapseSnackbarState: ScinapseSnackbarReducer,
  entities: EntityReducer,
});
