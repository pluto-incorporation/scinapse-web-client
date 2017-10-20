import { IReduxAction } from "../typings/actionType";
import { ACTION_TYPES } from "../actions/actionTypes";
import { CURRENT_USER_INITIAL_STATE, ICurrentUserRecord, recordifyCurrentUser } from "../model/currentUser";

export function reducer(state = CURRENT_USER_INITIAL_STATE, action: IReduxAction<any>): ICurrentUserRecord {
  switch (action.type) {
    case ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN: {
      return recordifyCurrentUser(action.payload.user).set("isLoggedIn", true);
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_SIGN_OUT: {
      return CURRENT_USER_INITIAL_STATE;
    }

    case ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN: {
      return recordifyCurrentUser(action.payload.user).set("isLoggedIn", true);
    }

    case ACTION_TYPES.PROFILE_SUCCEEDED_TO_UPDATE_USER_PROFILE: {
      return recordifyCurrentUser(action.payload.userProfile).set("isLoggedIn", true);
    }

    default:
      return state;
  }
}
