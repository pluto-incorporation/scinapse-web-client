import { Test } from './abTest';
import {
  BROAD_AUTHOR_VENUE_TEST,
  GURU_AT_SEARCH_TEST,
  KNOWLEDGE_BASED_RECOMMEND_TEST,
  SOURCE_DOMAIN_TEST,
  DUMMY_TEST,
} from './abTestGlobalValue';

export const broadAuthorVenue: Test = {
  name: BROAD_AUTHOR_VENUE_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'broadAuthorVenue', weight: 1 }],
};

export const guruAtSearch: Test = {
  name: GURU_AT_SEARCH_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'guru', weight: 4 }],
};

export const knowledgeBasedRecommend: Test = {
  name: KNOWLEDGE_BASED_RECOMMEND_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'knowledgeBasedRecommend', weight: 1 }],
};

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};

export const sourceDomain: Test = {
  name: SOURCE_DOMAIN_TEST,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'sourceDomain', weight: 1 }],
};
