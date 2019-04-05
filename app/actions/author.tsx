import axios, { CancelToken } from "axios";
import { normalize } from "normalizr";
import { Dispatch } from "react-redux";
import { ActionCreators } from "./actionTypes";
import alertToast from "../helpers/makePlutoToastAction";
import PlutoAxios from "../api/pluto";
import AuthorAPI, { ConnectAuthorParams, DEFAULT_AUTHOR_PAPERS_SIZE } from "../api/author";
import ProfileAPI, { AwardParams, EducationParams, ExperienceParams } from "../api/profile";
import { GetAuthorPapersParams } from "../api/author/types";
import { Paper, paperSchema } from "../model/paper";
import { CVInfoType } from "../model/profile";
import { CurrentUser } from "../model/currentUser";
import { GLOBAL_DIALOG_TYPE } from "../components/dialog/reducer";
import { AUTHOR_PAPER_LIST_SORT_TYPES } from "../components/common/sortBox";
import { getAuthor, getCoAuthors, getAuthorPapers } from "../containers/unconnectedAuthorShow/actions";
import { CommonError } from "../model/error";

interface AddRemovePapersAndFetchPapersParams {
  authorId: number;
  papers: Paper[];
  currentUser: CurrentUser;
  cancelToken: CancelToken;
}

interface FetchAuthorShowRelevantDataParams {
  authorId: number;
  cancelToken: CancelToken;
  currentUser?: CurrentUser;
  page?: number;
  sort?: AUTHOR_PAPER_LIST_SORT_TYPES;
}

export function fetchAuthorPapers(params: GetAuthorPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch(
      getAuthorPapers({
        authorId: params.authorId,
        query: params.query,
        size: params.size,
        page: params.page,
        sort: params.sort,
        cancelToken: params.cancelToken,
      })
    );
  };
}

export function fetchAuthorShowRelevantData(params: FetchAuthorShowRelevantDataParams) {
  return async (dispatch: Dispatch<any>) => {
    const { currentUser, authorId, cancelToken } = params;

    try {
      dispatch(ActionCreators.startToLoadAuthorShowPageData());
      const isMine =
        currentUser && currentUser.isLoggedIn && currentUser.isAuthorConnected && currentUser.authorId === authorId;
      const promiseArr = [];
      promiseArr.push(dispatch(getAuthor(authorId, cancelToken)));
      promiseArr.push(dispatch(getCoAuthors(authorId, cancelToken)));
      promiseArr.push(
        dispatch(
          fetchAuthorPapers({
            authorId,
            size: DEFAULT_AUTHOR_PAPERS_SIZE,
            page: params.page ? params.page : 1,
            sort: isMine ? "RECENTLY_ADDED" : "NEWEST_FIRST",
            cancelToken: params.cancelToken,
          })
        )
      );

      await Promise.all(promiseArr);
      dispatch(ActionCreators.finishToLoadAuthorShowPageData());
    } catch (err) {
      if (!axios.isCancel(err)) {
        const error = PlutoAxios.getGlobalError(err);
        console.error(`Error for fetching author show page data`, error);
        dispatch(ActionCreators.failedToLoadAuthorShowPageData({ statusCode: (error as CommonError).status }));
      }
    }
  };
}

export function updateAuthor(params: ConnectAuthorParams) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToUpdateProfileData());

    const authorResponse = await AuthorAPI.updateAuthor(params);

    dispatch(ActionCreators.addEntity(authorResponse));
    dispatch(ActionCreators.succeededToUpdateProfileData());
  };
}

export function postNewAuthorCVInfo(
  type: keyof CVInfoType,
  authorId: number,
  params: AwardParams | EducationParams | ExperienceParams
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToAddProfileCvData({ CVType: type }));

    let result: any;
    if (type === "awards") {
      result = await ProfileAPI.postNewAwardInAuthor(authorId, params as AwardParams);
    } else if (type === "educations") {
      result = await ProfileAPI.postNewEducationInAuthor(authorId, params as EducationParams);
    } else if (type === "experiences") {
      result = await ProfileAPI.postNewExperienceInAuthor(authorId, params as ExperienceParams);
    }

    dispatch(ActionCreators.succeedToAddProfileCvData({ authorId, cvInfoType: type, cvInformation: result }));
  };
}

export function removeAuthorCvInfo(type: keyof CVInfoType, authorId: number, id: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToRemoveProfileCvData({ CVType: type }));
    let result: any;
    try {
      if (type === "awards") {
        result = await ProfileAPI.deleteAwardInAuthor(id);
      } else if (type === "educations") {
        result = await ProfileAPI.deleteEducationInAuthor(id);
      } else if (type === "experiences") {
        result = await ProfileAPI.deleteExperienceInAuthor(id);
      }

      dispatch(ActionCreators.succeededToRemoveProfileCvData({ authorId, cvInfoType: type, cvInformation: result }));
    } catch (err) {
      dispatch(ActionCreators.failToRemoveProfileCvData());
      alertToast({
        type: "error",
        message: `Had an error to delete ${type} data.`,
      });
    }
  };
}

export function updateAuthorCvInfo(
  type: keyof CVInfoType,
  authorId: number,
  params: AwardParams | EducationParams | ExperienceParams
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(ActionCreators.startToUpdateProfileCvData({ CVType: type }));
    let result: any;
    if (type === "awards") {
      result = await ProfileAPI.updateAwardInAuthor(params as AwardParams);
    } else if (type === "educations") {
      result = await ProfileAPI.updateEducationInAuthor(params as EducationParams);
    } else if (type === "experiences") {
      result = await ProfileAPI.updateExperienceInAuthor(params as ExperienceParams);
    }

    dispatch(ActionCreators.succeededToUpdateProfileCvData({ authorId, cvInfoType: type, cvInformation: result }));
  };
}

export function updateProfileImage(authorId: number, formData: FormData) {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(ActionCreators.startToUpdateProfileImageData());

      const profileImg = await AuthorAPI.updateAuthorProfileImage(authorId, formData);
      const profileImageUrl = profileImg.data.content.profileImageUrl;

      dispatch(ActionCreators.addEntity(profileImg));
      dispatch(ActionCreators.succeededToUpdateProfileImageData({ authorId, profileImageUrl }));
    } catch (err) {
      alertToast({ type: "error", message: "Had an error to upload profile image" });
      dispatch(ActionCreators.failedToUpdateProfileImageData());
    }
  };
}

function addPaperToAuthorPaperList(authorId: number, papers: Paper[], cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    const paperIds = papers.map(paper => paper.id);
    dispatch(ActionCreators.startToAddPaperToAuthorPaperList());

    await AuthorAPI.addPapersToAuthorPaperList(authorId, paperIds, cancelToken);

    // HACK: you should normalize papers in API level
    const normalizedPapers = normalize(papers, [paperSchema]);
    dispatch(ActionCreators.addEntity(normalizedPapers));
    dispatch(ActionCreators.succeededToAddPaperToAuthorPaperList());
  };
}

export function addPapersAndFetchPapers(params: AddRemovePapersAndFetchPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    try {
      await dispatch(addPaperToAuthorPaperList(params.authorId, params.papers, params.cancelToken));
      await dispatch(
        fetchAuthorShowRelevantData({
          authorId: params.authorId,
          currentUser: params.currentUser,
          cancelToken: params.cancelToken,
        })
      );
    } catch (err) {
      dispatch(ActionCreators.failedToAddPaperToAuthorPaperList());
    }
  };
}

export function removePaperFromPaperList(params: AddRemovePapersAndFetchPapersParams) {
  return async (dispatch: Dispatch<any>) => {
    const paper = params.papers[0];

    try {
      await AuthorAPI.removeAuthorPapers(params.authorId, [paper.id]);
      await dispatch(
        fetchAuthorShowRelevantData({
          authorId: params.authorId,
          currentUser: params.currentUser,
          cancelToken: params.cancelToken,
        })
      );
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      console.error(error);
      alertToast({
        type: "error",
        message: "Had an error to remove publication",
      });
    }
  };
}

export function openAddPublicationsToAuthorDialog() {
  return ActionCreators.openGlobalDialog({ type: GLOBAL_DIALOG_TYPE.ADD_PUBLICATIONS_TO_AUTHOR_DIALOG });
}

export function updateRepresentativePapers(authorId: number, papers: Paper[]) {
  return async (dispatch: Dispatch<any>) => {
    await AuthorAPI.updateRepresentativePapers({
      authorId,
      paperIds: papers.map(paper => paper.id),
    });

    dispatch(
      ActionCreators.succeedToUpdateAuthorRepresentativePapers({
        authorId,
        papers,
      })
    );
  };
}
