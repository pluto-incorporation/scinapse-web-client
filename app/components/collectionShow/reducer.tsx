import { ACTION_TYPES, Actions } from "../../actions/actionTypes";
import { AUTHOR_PAPER_LIST_SORT_TYPES } from "../common/sortBox";

export interface CollectionShowState
  extends Readonly<{
      isLoadingCollection: boolean;
      failedToLoadingCollection: boolean;
      mainCollectionId: number;
      papersTotalPage: number;
      papersCurrentPage: number;
      papersTotalCount: number;
      sortType: AUTHOR_PAPER_LIST_SORT_TYPES;
      paperIds: number[];
    }> {}

export const INITIAL_COLLECTION_SHOW_STATE: CollectionShowState = {
  isLoadingCollection: false,
  failedToLoadingCollection: false,
  mainCollectionId: 0,
  papersTotalPage: 0,
  papersCurrentPage: 1,
  papersTotalCount: 0,
  sortType: "RECENTLY_ADDED",
  paperIds: [],
};

export function reducer(
  state: CollectionShowState = INITIAL_COLLECTION_SHOW_STATE,
  action: Actions
): CollectionShowState {
  switch (action.type) {
    case ACTION_TYPES.COLLECTION_SHOW_START_TO_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: true,
        failedToLoadingCollection: false,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        mainCollectionId: action.payload.collectionId,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_FAILED_TO_GET_COLLECTION: {
      return {
        ...state,
        isLoadingCollection: false,
        failedToLoadingCollection: true,
      };
    }

    case ACTION_TYPES.COLLECTION_SHOW_SUCCEEDED_GET_PAPERS: {
      return {
        ...state,
        paperIds: action.payload.paperIds,
        sortType: action.payload.sort as AUTHOR_PAPER_LIST_SORT_TYPES,
        papersTotalPage: action.payload.totalPages,
        papersCurrentPage: action.payload.number + 1,
        papersTotalCount: action.payload.totalElements,
      };
    }

    default:
      return state;
  }
}
