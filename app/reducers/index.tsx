import * as Redux from "redux";
import { RouterState } from "connected-react-router";
import * as ConfigurationReducer from "./configuration";
import * as currentUserReducer from "./currentUser";
import * as signUpReducer from "../components/auth/signUp/reducer";
import * as signInReducer from "../components/auth/signIn/reducer";
import { CURRENT_USER_INITIAL_STATE, CurrentUser } from "../model/currentUser";
import * as dialogReducer from "../components/dialog/reducer";
import * as layoutReducer from "../components/layouts/reducer";
import { LAYOUT_INITIAL_STATE, LayoutState } from "../components/layouts/records";
import * as articleSearchReducer from "../components/articleSearch/reducer";
import { ARTICLE_SEARCH_INITIAL_STATE, ArticleSearchState } from "../components/articleSearch/records";
import * as emailVerificationReducer from "../components/auth/emailVerification/reducer";
import { PaperShowState, PAPER_SHOW_INITIAL_STATE } from "../components/paperShow/records";
import { reducer as paperShowReducer } from "../components/paperShow/reducer";
import {
  reducer as AuthorShowReducer,
  AuthorShowState,
  AUTHOR_SHOW_INITIAL_STATE,
} from "../components/authorShow/reducer";
import { reducer as EntityReducer, INITIAL_ENTITY_STATE, EntityState } from "./entity";
import * as homeReducer from "../components/home/reducer";
import { HomeState, HOME_INITIAL_STATE } from "../components/home/records";
import {
  ProfileNewState,
  PROFILE_NEW_STATE_INITIAL_STATE,
  reducer as ProfileNewReducer,
} from "../containers/newProfile/reducer";
import {
  reducer as CollectionShowReducer,
  CollectionShowState,
  INITIAL_COLLECTION_SHOW_STATE,
} from "../components/collectionShow/reducer";
import {
  reducer as UserCollectionsReducer,
  UserCollectionsState,
  USER_COLLECTIONS_INITIAL_STATE,
} from "../components/collections/reducer";
import {
  reducer as JournalShowReducer,
  JournalShowState,
  JOURNAL_SHOW_INITIAL_STATE,
} from "../components/journalShow/reducer";
import {
  ProfileShowState,
  PROFILE_SHOW_STATE_INITIAL_STATE,
  reducer as ProfileReducer,
} from "../containers/profileShow/reducer";

export interface AppState {
  router?: RouterState;
  configuration: ConfigurationReducer.Configuration;
  signUp: signUpReducer.SignUpState;
  signIn: signInReducer.SignInState;
  dialog: dialogReducer.DialogState;
  layout: LayoutState;
  home: HomeState;
  emailVerification: emailVerificationReducer.EmailVerificationState;
  currentUser: CurrentUser | null;
  articleSearch: ArticleSearchState;
  paperShow: PaperShowState;
  authorShow: AuthorShowState;
  journalShow: JournalShowState;
  collectionShow: CollectionShowState;
  userCollections: UserCollectionsState;
  profileShow: ProfileShowState;
  profileNew: ProfileNewState;
  entities: EntityState;
}

export const initialState: AppState = {
  configuration: ConfigurationReducer.CONFIGURATION_INITIAL_STATE,
  signUp: signUpReducer.SIGN_UP_INITIAL_STATE,
  signIn: signInReducer.SIGN_IN_INITIAL_STATE,
  dialog: dialogReducer.DIALOG_INITIAL_STATE,
  home: HOME_INITIAL_STATE,
  layout: LAYOUT_INITIAL_STATE,
  emailVerification: emailVerificationReducer.EMAIL_VERIFICATION_INITIAL_STATE,
  currentUser: CURRENT_USER_INITIAL_STATE,
  articleSearch: ARTICLE_SEARCH_INITIAL_STATE,
  paperShow: PAPER_SHOW_INITIAL_STATE,
  authorShow: AUTHOR_SHOW_INITIAL_STATE,
  journalShow: JOURNAL_SHOW_INITIAL_STATE,
  collectionShow: INITIAL_COLLECTION_SHOW_STATE,
  userCollections: USER_COLLECTIONS_INITIAL_STATE,
  profileShow: PROFILE_SHOW_STATE_INITIAL_STATE,
  profileNew: PROFILE_NEW_STATE_INITIAL_STATE,
  entities: INITIAL_ENTITY_STATE,
};

export const rootReducer: Redux.Reducer<AppState> = Redux.combineReducers({
  configuration: ConfigurationReducer.reducer,
  signUp: signUpReducer.reducer,
  signIn: signInReducer.reducer,
  dialog: dialogReducer.reducer,
  home: homeReducer.reducer,
  layout: layoutReducer.reducer,
  articleSearch: articleSearchReducer.reducer,
  emailVerification: emailVerificationReducer.reducer,
  paperShow: paperShowReducer,
  authorShow: AuthorShowReducer,
  journalShow: JournalShowReducer,
  currentUser: currentUserReducer.reducer,
  collectionShow: CollectionShowReducer,
  userCollections: UserCollectionsReducer,
  profileShow: ProfileReducer,
  profileNew: ProfileNewReducer,
  entities: EntityReducer,
});
