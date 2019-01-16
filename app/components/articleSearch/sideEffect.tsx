import PaperSearchQueryFormatter from "../../helpers/papersQueryFormatter";
import { LoadDataParams } from "../../routes";
import { fetchSearchPapers } from "./actions";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { GetPapersParams } from "../../api/types/paper";

export async function getSearchData(params: LoadDataParams<null>) {
  const { queryParams, dispatch } = params;

  const searchQueryObject: GetPapersParams = PaperSearchQueryFormatter.makeSearchQueryFromParamsObject(queryParams);

  try {
    const promiseArray: Array<Promise<any>> = [];

    promiseArray.push(dispatch(fetchSearchPapers(searchQueryObject)));

    await Promise.all(promiseArray);

    dispatch({
      type: ACTION_TYPES.ARTICLE_SEARCH_SAVE_LAST_SUCCEEDED_PARAMS,
      payload: {
        params: JSON.stringify(params.queryParams),
      },
    });
  } catch (err) {
    console.error(`Error for fetching search result page data`, err);
  }
}
