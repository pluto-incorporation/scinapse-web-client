import { denormalize } from "normalizr";
import { createSelector } from "reselect";
import { getPaperEntities } from "../../selectors/papersSelector";
import { paperSchema } from "../../model/paper";
import { AppState } from "../../reducers";

function getPaperId(state: AppState) {
  return state.paperShow.paperId;
}

function getReferencePaperIds(state: AppState) {
  return state.paperShow.referencePaperIds;
}

function getCitedPaperIds(state: AppState) {
  return state.paperShow.citedPaperIds;
}

export const getMemoizedPaper = createSelector([getPaperId, getPaperEntities], (paperId, paperEntities) => {
  return denormalize(paperId, paperSchema, { papers: paperEntities });
});

export const getReferencePapers = createSelector(
  [getReferencePaperIds, getPaperEntities],
  (paperIds, paperEntities) => {
    return denormalize(paperIds, [paperSchema], paperEntities);
  }
);

export const getCitedPapers = createSelector([getCitedPaperIds, getPaperEntities], (paperIds, paperEntities) => {
  return denormalize(paperIds, [paperSchema], paperEntities);
});
