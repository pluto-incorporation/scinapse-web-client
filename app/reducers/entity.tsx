import { Author } from "../model/author/author";
import { Actions, ACTION_TYPES } from "../actions/actionTypes";
import { Paper } from "../model/paper";
import { Comment } from "../model/comment";
import { Collection } from "../model/collection";
import { Member } from "../model/member";
import { Journal } from "../model/journal";
import { merge } from "lodash";
import { PaperInCollection } from "../model/paperInCollection";
import { Profile } from "../model/profile";

export interface NormalizedPaperListResponse {
  entities: { papers: { [paperId: number]: Paper } };
  result: number[];
}
/*
  ***************************************************
  ************CAUTION************
  ***************************************************
  Entities should not be nested object.
  They allow only 1-depth object to update because [Object Rest/Spread Properties for ECMAScript]
  allow only shallow merge.

  REFERENCE: https://github.com/tc39/proposal-object-rest-spread
*/

export interface AppEntities {
  authors: {
    [authorId: number]: Author;
  };
  papers: {
    [paperId: number]: Paper;
  };
  papersInCollection: {
    [paperId: number]: PaperInCollection;
  };
  comments: {
    [commentId: number]: Comment;
  };
  collections: {
    [collectionId: number]: Collection;
  };
  members: {
    [memberId: number]: Member;
  };
  journals: {
    [journalId: number]: Journal;
  };
  profiles: {
    [authorId: number]: Profile;
  };
}

export interface EntityState extends Readonly<AppEntities> {}

export const INITIAL_ENTITY_STATE = {
  authors: {},
  papers: {},
  papersInCollection: {},
  comments: {},
  collections: {},
  members: {},
  journals: {},
  profiles: {},
};

export function reducer(state: EntityState = INITIAL_ENTITY_STATE, action: Actions) {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_ADD_ENTITY:
      const { entities } = action.payload;

      if (!entities) {
        return state;
      }

      let newCollections: { [collectionId: number]: Collection } = {};
      if (entities.collections) {
        const receivedCollections = entities.collections;
        newCollections = merge(state.collections, receivedCollections);
      }

      return {
        ...state,
        authors: { ...state.authors, ...entities.authors },
        papers: { ...state.papers, ...entities.papers },
        papersInCollection: { ...state.papersInCollection, ...entities.papersInCollection },
        comments: { ...state.comments, ...entities.comments },
        collections: { ...state.collections, ...newCollections },
        members: { ...state.members, ...entities.members },
        journals: { ...state.journals, ...entities.journals },
        profiles: { ...state.profiles, ...entities.profiles },
      };

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_POST_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_FAILED_TO_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.GLOBAL_START_TO_ADD_PAPER_TO_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [targetCollection.id]: {
          ...targetCollection,
          containsSelected: true,
          paperCount: targetCollection.paperCount + 1,
        },
      };

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.PAPER_SHOW_SUCCEEDED_REMOVE_PAPER_FROM_COLLECTION:
    case ACTION_TYPES.GLOBAL_FAILED_TO_ADD_PAPER_TO_COLLECTION:
    case ACTION_TYPES.GLOBAL_START_TO_REMOVE_PAPER_FROM_COLLECTION: {
      const targetCollection = action.payload.collection;
      const newCollections = {
        ...state.collections,
        [targetCollection.id]: {
          ...targetCollection,
          containsSelected: false,
          paperCount: targetCollection.paperCount - 1,
          note: null,
        },
      };

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.GLOBAL_DIALOG_SUCCEEDED_DELETE_COLLECTION: {
      const targetCollectionId = action.payload.collectionId;
      const { [targetCollectionId]: deletedItem, ...newCollections } = state.collections;

      return { ...state, collections: newCollections };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_SUCCEEDED_TO_UPDATE_PAPER_NOTE: {
      const targetCollectionId = action.payload.collectionId;

      return {
        ...state,
        papersInCollection: {
          ...state.papersInCollection,
          [action.payload.paperId]: {
            ...state.papersInCollection[action.payload.paperId],
            note: action.payload.note,
          },
        },
        collections: {
          ...state.collections,
          [targetCollectionId]: {
            ...state.collections[targetCollectionId],
            containsSelected: true,
            note: action.payload.note,
            noteUpdated: !!action.payload.note,
          },
        },
      };
    }

    case ACTION_TYPES.PAPER_SHOW_COLLECTION_BUTTON_STALE_UPDATED_COLLECTION_NOTE: {
      const targetCollectionId = action.payload.collectionId;

      return {
        ...state,
        collections: {
          ...state.collections,
          [targetCollectionId]: {
            ...state.collections[targetCollectionId],
            noteUpdated: false,
          },
        },
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_CHANGE_REPRESENTATIVE_PAPERS: {
      const { authorId, papers } = action.payload;

      return {
        ...state,
        authors: {
          ...state.authors,
          [authorId]: {
            ...state.authors[authorId],
            representativePapers: papers,
          },
        },
      };
    }

    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_ADD_PROFILE_CV_DATA:
    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_CV_DATA:
    case ACTION_TYPES.AUTHOR_SHOW_SUCCEEDED_TO_REMOVE_PROFILE_CV_DATA: {
      const { authorId, cvInformation, cvInfoType } = action.payload;

      const profiles = state.profiles[authorId];

      return {
        ...state,
        profiles: {
          ...profiles,
          [authorId]: {
            ...profiles,
            [cvInfoType]: cvInformation,
          },
        },
      };
    }

    case ACTION_TYPES.CONNECTED_AUTHOR_SHOW_SUCCEEDED_TO_UPDATE_PROFILE_IMAGE_DATA: {
      const { authorId, profileImageUrl } = action.payload;

      return {
        ...state,
        authors: {
          ...state.authors,
          [authorId]: {
            ...state.authors[authorId],
            profileImageUrl,
          },
        },
        members: {
          ...state.members,
          [authorId]: {
            ...state.members[authorId],
            profileImageUrl,
          },
        },
      };
    }

    case ACTION_TYPES.GLOBAL_FLUSH_ENTITIES:
      return INITIAL_ENTITY_STATE;

    default:
      return state;
  }
}
