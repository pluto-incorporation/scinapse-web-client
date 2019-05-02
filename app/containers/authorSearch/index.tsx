import * as React from "react";
import axios from "axios";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { AppState } from "../../reducers";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
import { withStyles } from "../../helpers/withStylesHelper";
import { getAuthorSearchData } from "./sideEffect";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import restoreScroll from "../../helpers/scrollRestoration";
import ArticleSpinner from "../../components/common/spinner/articleSpinner";
import ErrorPage from "../../components/error/errorPage";
import { AuthorSearchState } from "./records";
import { CurrentUser } from "../../model/currentUser";
import { LayoutState, UserDevice } from "../../components/layouts/records";
import { Configuration } from "../../reducers/configuration";
import { Helmet } from "react-helmet";
import { Footer } from "../../components/layouts";
import AuthorSearchLongItem from "../../components/authorSearchLongItem";
import MobilePagination from "../../components/common/mobilePagination";
import DesktopPagination from "../../components/common/desktopPagination";
import { ArticleSearchState } from "../../components/articleSearch/records";
import NoResultInSearch from "../../components/articleSearch/components/noResultInSearch";
import TabNavigationBar from "../../components/common/tabNavigationBar";
import { getUrlDecodedQueryParamsObject } from "../../helpers/makeNewFilterLink";
import EnvChecker from "../../helpers/envChecker";
import ActionTicketManager from "../../helpers/actionTicketManager";
import { Author } from "../../model/author/author";
const styles = require("./authorSearch.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearch: state.articleSearch,
    authorSearch: state.authorSearch,
    currentUser: state.currentUser,
    configuration: state.configuration,
  };
}

export interface AuthorSearchProps extends RouteComponentProps<null> {
  layout: LayoutState;
  currentUser: CurrentUser;
  articleSearch: ArticleSearchState;
  authorSearch: AuthorSearchState;
  configuration: Configuration;
  dispatch: Dispatch<any>;
}

@withStyles<typeof AuthorSearch>(styles)
class AuthorSearch extends React.PureComponent<AuthorSearchProps> {
  private cancelToken = axios.CancelToken.source();

  public async componentDidMount() {
    const { configuration, dispatch, match, location, authorSearch } = this.props;
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

      const authors = await getAuthorSearchData(currentParams);
      // TODO: change logging logic much easier after chainging the class component to React hooks.
      this.logSearchResult(authors);
      restoreScroll(location.key);
    } else {
      // TODO: change logging logic much easier after chainging the class component to React hooks.
      this.logSearchResult(authorSearch.searchItemsToShow);
    }
  }

  public async componentWillReceiveProps(nextProps: AuthorSearchProps) {
    const { dispatch, match, location } = this.props;
    const beforeSearch = location.search;
    const afterSearch = nextProps.location.search;

    if (!!afterSearch && beforeSearch !== afterSearch) {
      const authors = await getAuthorSearchData({
        dispatch,
        match,
        pathname: nextProps.location.pathname,
        queryParams: getQueryParamsObject(afterSearch),
        cancelToken: this.cancelToken.token,
      });
      this.logSearchResult(authors);
      restoreScroll(nextProps.location.key);
    }
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { authorSearch, location } = this.props;
    const { isLoading } = authorSearch;
    const queryParams = getUrlDecodedQueryParamsObject(location);

    const hasNoAuthorSearchResult = !authorSearch.searchItemsToShow || authorSearch.searchItemsToShow.length === 0;

    if (authorSearch.pageErrorCode) {
      return <ErrorPage errorNum={authorSearch.pageErrorCode} />;
    }

    if (hasNoAuthorSearchResult && queryParams) {
      return isLoading ? (
        this.renderLoadingSpinner()
      ) : (
        <>
          <TabNavigationBar searchKeyword={authorSearch.searchInput} />
          <NoResultInSearch
            searchText={queryParams.query}
            otherCategoryCount={authorSearch.totalElements}
            type="author"
          />
        </>
      );
    } else if (queryParams) {
      return (
        <div className={styles.rootWrapper}>
          <TabNavigationBar searchKeyword={authorSearch.searchInput} />
          <div className={styles.articleSearchContainer}>
            {this.getResultHelmet(queryParams.query)}
            <div className={styles.innerContainer}>
              {isLoading ? this.renderLoadingSpinner() : this.getAuthorEntitiesSection()}
              {this.getPaginationComponent()}
            </div>
          </div>
          <Footer containerStyle={this.getContainerStyle()} />
        </div>
      );
    } else {
      // TODO: Make an error alerting page
      return null;
    }
  }

  private logSearchResult = (searchResult?: Author[] | null) => {
    if (!EnvChecker.isOnServer()) {
      // TODO: replace almost same logic with ArticleSearch container's same method
      if (!searchResult || searchResult.length === 0) {
        ActionTicketManager.trackTicket({
          pageType: "authorSearchResult",
          actionType: "view",
          actionArea: "authorList",
          actionTag: "pageView",
          actionLabel: String(0),
        });
      } else {
        ActionTicketManager.trackTicket({
          pageType: "authorSearchResult",
          actionType: "view",
          actionArea: "authorList",
          actionTag: "pageView",
          actionLabel: String(searchResult.length),
        });
      }
    }
  };

  private getAuthorEntitiesSection = () => {
    const { authorSearch } = this.props;
    const authorEntities = authorSearch.searchItemsToShow;

    if (authorEntities && authorEntities.length > 0) {
      const matchAuthorCount = authorSearch.totalElements;
      const authorItems = authorEntities.map(matchEntity => {
        return <AuthorSearchLongItem authorEntity={matchEntity} key={matchEntity.id} />;
      });
      return (
        <div>
          <div className={styles.authorItemsHeader}>
            <span className={styles.categoryHeader}>Author</span>
            <span className={styles.categoryCount}>{matchAuthorCount}</span>
          </div>
          <div className={styles.authorItemsWrapper}>{authorItems}</div>
        </div>
      );
    }

    return null;
  };
  private getPaginationComponent = () => {
    const { authorSearch, layout } = this.props;
    const { page, totalPages } = authorSearch;

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

  private makePaginationLink = (page: number) => {
    const { location } = this.props;
    const queryParamsObject = getUrlDecodedQueryParamsObject(location);
    const queryParams = PapersQueryFormatter.stringifyPapersQuery({
      ...queryParamsObject,
      page,
    });

    return `/search/authors?${queryParams}`;
  };

  private renderLoadingSpinner = () => {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  };

  private getResultHelmet = (query: string) => {
    return (
      <Helmet>
        <title>{`${query} | Scinapse | Academic search engine for author`}</title>
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
}
export default connect(mapStateToProps)(withRouter(AuthorSearch));
