import * as React from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { AppState } from "../../reducers";
import * as Actions from "./actions";
import SearchList from "./components/searchList";
import ArticleSpinner from "../common/spinner/articleSpinner";
import SortBox from "./components/sortBox";
import FilterContainer from "./components/filterContainer";
import NoResult from "./components/noResult";
import PapersQueryFormatter, { SearchPageQueryParamsObject, FilterObject } from "../../helpers/papersQueryFormatter";
import formatNumber from "../../helpers/formatNumber";
import { ArticleSearchContainerProps } from "./types";
import { Footer } from "../layouts";
import DesktopPagination from "../common/desktopPagination";
import MobilePagination from "../common/mobilePagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { getSearchData } from "./sideEffect";
import SafeURIStringHandler from "../../helpers/safeURIStringHandler";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import { UserDevice } from "../layouts/records";
import AuthorSearchItem from "../authorSearchItem";
import restoreScroll from "../../helpers/scrollRestoration";
import { ChangeRangeInputParams, FILTER_BOX_TYPE, FILTER_TYPE_HAS_EXPANDING_OPTION } from "../../constants/paperSearch";
import ErrorPage from "../error/errorPage";
import EnvChecker from "../../helpers/envChecker";
import getExpUserType from "../../helpers/getExpUserType";
const styles = require("./articleSearch.scss");

const COOKIE_STRING = EnvChecker.isOnServer() ? "" : document.cookie;

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    currentUserState: state.currentUser,
    configuration: state.configuration,
  };
}

@withStyles<typeof ArticleSearch>(styles)
class ArticleSearch extends React.PureComponent<ArticleSearchContainerProps> {
  private cancelToken = axios.CancelToken.source();

  public async componentDidMount() {
    const { configuration, dispatch, match, location } = this.props;
    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.succeedAPIFetchAtServer || configuration.renderedAtClient;

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      const currentParams = {
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: getQueryParamsObject(location.search),
        cancelToken: this.cancelToken.token,
      };

      await getSearchData(currentParams);
      restoreScroll(location.key);
    }
  }

  public async componentWillReceiveProps(nextProps: ArticleSearchContainerProps) {
    const { dispatch, match, location } = this.props;
    const beforeSearch = location.search;
    const afterSearch = nextProps.location.search;

    if (!!afterSearch && beforeSearch !== afterSearch) {
      await getSearchData({
        dispatch,
        match,
        pathname: nextProps.location.pathname,
        queryParams: getQueryParamsObject(afterSearch),
        cancelToken: this.cancelToken.token,
      });
      restoreScroll(nextProps.location.key);
    }
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { articleSearchState, currentUserState } = this.props;
    const { isLoading, totalElements, totalPages, searchItemsToShow } = articleSearchState;
    const queryParams = this.getUrlDecodedQueryParamsObject();

    if (articleSearchState.pageErrorCode) {
      return <ErrorPage errorNum={articleSearchState.pageErrorCode} />;
    }

    const hasNoSearchResult =
      !articleSearchState.searchItemsToShow || articleSearchState.searchItemsToShow.length === 0;

    if (isLoading) {
      return this.renderLoadingSpinner();
    } else if (hasNoSearchResult && queryParams) {
      return <NoResult searchText={queryParams.query} articleSearchState={articleSearchState} />;
    } else if (queryParams) {
      return (
        <div className={styles.rootWrapper}>
          <div className={styles.articleSearchContainer}>
            {this.getResultHelmet(queryParams.query)}
            <div className={styles.innerContainer}>
              {this.getRelatedKeywordBox()}
              {this.getSuggestionKeywordBox()}
              {this.getAuthorEntitiesSection()}
              <div className={styles.searchSummary}>
                <span className={styles.searchPage}>
                  {articleSearchState.page} page of {formatNumber(totalPages)} pages ({formatNumber(totalElements)}{" "}
                  results)
                </span>
                <SortBox query={queryParams.query} sortOption={queryParams.sort} />
              </div>
              <SearchList
                currentUser={currentUserState}
                papers={searchItemsToShow}
                searchQueryText={
                  articleSearchState.searchFromSuggestion ? articleSearchState.suggestionKeyword : queryParams.query
                }
              />
              {this.getPaginationComponent()}
            </div>
            <FilterContainer
              makeNewFilterLink={this.makeNewFilterLink}
              handleChangeRangeInput={this.setRangeInput}
              handleToggleExpandingFilter={this.handleToggleExpandingFilter}
              handleToggleFilterBox={this.handleToggleFilterBox}
              articleSearchState={articleSearchState}
            />
          </div>
          <Footer containerStyle={this.getContainerStyle()} />
        </div>
      );
    } else {
      // TODO: Make an error alerting page
      return null;
    }
  }

  private getSuggestionKeywordBox = () => {
    const { articleSearchState } = this.props;
    const queryParams = this.getUrlDecodedQueryParamsObject();

    if (articleSearchState.searchFromSuggestion) {
      return (
        <div className={styles.suggestionBox}>
          <div className={styles.noResult}>
            {`No result found for `}
            <b>{queryParams.query}</b>
          </div>
          <div className={styles.suggestionResult}>
            {`Showing results for `}
            <Link
              to={{
                pathname: "/search",
                search: PapersQueryFormatter.stringifyPapersQuery({
                  query: articleSearchState.suggestionKeyword,
                  sort: "RELEVANCE",
                  filter: {},
                  page: 1,
                }),
              }}
            >
              <b>{articleSearchState.suggestionKeyword}</b>
            </Link>
          </div>
        </div>
      );
    }

    if (articleSearchState.suggestionKeyword) {
      return (
        <div className={styles.suggestionBox}>
          <span>{`Did you mean `}</span>
          <Link
            to={{
              pathname: "/search",
              search: PapersQueryFormatter.stringifyPapersQuery({
                query: articleSearchState.suggestionKeyword,
                sort: "RELEVANCE",
                filter: {},
                page: 1,
              }),
            }}
            className={styles.suggestionLink}
          >
            <b>{articleSearchState.suggestionKeyword}</b>
          </Link>
          <span>{` ?`}</span>
        </div>
      );
    } else {
      return null;
    }
  };

  private getAuthorEntitiesSection = () => {
    const { articleSearchState } = this.props;

    const authorItems = articleSearchState.matchEntities
      .filter(matchEntity => matchEntity.type === "AUTHOR")
      .slice(0, 2)
      .map(matchEntity => {
        return <AuthorSearchItem authorEntity={matchEntity} key={matchEntity.entity.id} />;
      });

    return <div className={styles.authorItemsWrapper}>{authorItems}</div>;
  };

  private getRelatedKeywordBox = () => {
    const { articleSearchState } = this.props;
    const queryParams = this.getUrlDecodedQueryParamsObject();
    if (EnvChecker.isOnServer() || getExpUserType(COOKIE_STRING) !== "A") {
      return null;
    }

    const keywordList = articleSearchState.aggregationData ? articleSearchState.aggregationData.keywordList : [];

    if (keywordList.length === 0) {
      return null;
    }

    const relatedKeywordItems = keywordList.filter(k => queryParams.query.indexOf(k) === -1).map(keyword => (
      <div key={keyword} className={styles.relatedKeywords}>
        <Link
          to={{
            pathname: "/search",
            search: PapersQueryFormatter.stringifyPapersQuery({
              query: `${queryParams.query} ${keyword.toLowerCase()}`,
              sort: "RELEVANCE",
              filter: {},
              page: 1,
            }),
          }}
        >
          {keyword.toLowerCase()}
        </Link>
      </div>
    ));

    return <div className={styles.relatedKeywordsContainer}>{relatedKeywordItems}</div>;
  };

  private getResultHelmet = (query: string) => {
    return (
      <Helmet>
        <title>{`${query} | Scinapse | Academic search engine for paper`}</title>
      </Helmet>
    );
  };

  private getContainerStyle = (): React.CSSProperties => {
    const { layout } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return { position: "absolute", width: "100", bottom: "unset" };
    } else {
      return { position: "absolute", left: "0", right: "0", bottom: "0" };
    }
  };

  private getPaginationComponent = () => {
    const { articleSearchState, layout } = this.props;
    const { page, totalPages } = articleSearchState;

    const currentPageIndex: number = page - 1;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={totalPages}
          currentPageIndex={currentPageIndex}
          getLinkDestination={this.makePaginationLink}
          wrapperStyle={{
            margin: "12px 0",
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type="search_result_papers"
          totalPage={totalPages}
          currentPageIndex={currentPageIndex}
          getLinkDestination={this.makePaginationLink}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      );
    }
  };

  private makeNewFilterLink = (newFilter: FilterObject) => {
    const queryParamsObject = this.getUrlDecodedQueryParamsObject();

    return `/search?${PapersQueryFormatter.stringifyPapersQuery({
      query: queryParamsObject.query,
      page: 1,
      sort: queryParamsObject.sort,
      filter: { ...queryParamsObject.filter, ...newFilter },
    })}`;
  };

  private makePaginationLink = (page: number) => {
    const queryParamsObject = this.getUrlDecodedQueryParamsObject();
    const queryParams = PapersQueryFormatter.stringifyPapersQuery({
      ...queryParamsObject,
      page,
    });

    return `/search?${queryParams}`;
  };

  private setRangeInput = (params: ChangeRangeInputParams) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeRangeInput(params));
  };

  private handleToggleFilterBox = (type: FILTER_BOX_TYPE) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleFilterBox(type));
  };

  private handleToggleExpandingFilter = (type: FILTER_TYPE_HAS_EXPANDING_OPTION) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleExpandingFilter(type));
  };

  private renderLoadingSpinner = () => {
    return (
      <div className={styles.articleSearchContainer}>
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      </div>
    );
  };

  private getUrlDecodedQueryParamsObject(): SearchPageQueryParamsObject {
    const { location } = this.props;
    const rawQueryParamsObj: Scinapse.ArticleSearch.RawQueryParams = getQueryParamsObject(location.search);

    return {
      query: SafeURIStringHandler.decode(rawQueryParamsObj.query),
      page: parseInt(rawQueryParamsObj.page, 10),
      filter: PapersQueryFormatter.objectifyPapersFilter(rawQueryParamsObj.filter),
      sort: rawQueryParamsObj.sort,
    };
  }
}
export default withRouter(connect(mapStateToProps)(ArticleSearch));
