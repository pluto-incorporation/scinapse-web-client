import { Test } from './abTest';
import { DUMMY_TEST, WEIGHTED_CITATION_EXPERIMENT, EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER } from './abTestGlobalValue';

export const enum EmailRecommendPaperSignUpBannerTestType {
  CONTROL = 'control',
  LETTERS = 'letters',
  TIRED = 'tired',
  WANDERING = 'wandering',
}

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};

export const weightedCitation: Test = {
  name: WEIGHTED_CITATION_EXPERIMENT,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'wc', weight: 3 }],
};

export const emailRecommendPaperSignUpBanner: Test = {
  name: EMAIL_RECOMMEND_PAPER_SIGN_UP_BANNER,
  userGroup: [
    { groupName: EmailRecommendPaperSignUpBannerTestType.CONTROL, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.LETTERS, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.TIRED, weight: 1 },
    { groupName: EmailRecommendPaperSignUpBannerTestType.WANDERING, weight: 1 },
  ],
};
