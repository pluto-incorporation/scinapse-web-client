import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AppState } from "../../reducers";
import Pagination from "../common/commonPagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import EnvChecker from "../../helpers/envChecker";
import SearchItems from "../articleSearch/components/searchItem";
import CitationDialog from "../common/citationDialog";
import { getBookmarks } from "../layouts/actions";
import {
  clearBookmarkPageState,
  setActiveCitationDialogPaperId,
  toggleCitationDialog,
  toggleAbstract,
  toggleAuthors,
  visitTitle,
  closeFirstOpen,
  handleClickCitationTab,
  getCitationText,
} from "./actions";
import { BookmarkPageStateRecord } from "./records";
import { BookmarkRecord } from "../../model/bookmark";
import { PaperRecord } from "../../model/paper";
import { postBookmark, removeBookmark, getBookmarkedStatus } from "../../actions/bookmark";
import { AvailableCitationType } from "../paperShow/records";
const styles = require("./bookmark.scss");

const DEFAULT_BOOKMARKS_FETCHING_COUNT = 10;

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
    bookmarks: state.bookmarks,
    bookmarkPage: state.bookmarkPage,
  };
}

export interface PaperShowMappedState {
  currentUser: CurrentUserRecord;
  routing: RouteProps;
  bookmarks: BookmarkRecord;
  bookmarkPage: BookmarkPageStateRecord;
}

export interface PaperShowProps extends DispatchProp<PaperShowMappedState>, RouteComponentProps<{ paperId: string }> {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  bookmarks: BookmarkRecord;
  bookmarkPage: BookmarkPageStateRecord;
}

@withStyles<typeof Bookmark>(styles)
class Bookmark extends React.PureComponent<PaperShowProps, {}> {
  public componentDidMount() {
    this.fetchBookmark();
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearBookmarkPageState());
  }

  public render() {
    const { currentUser } = this.props;

    if (EnvChecker.isServer()) {
      return this.getHelmetNode();
    }

    if (!currentUser.isLoggedIn) {
      return <div className={styles.container}>You should sign in first.</div>;
    }

    return (
      <div className={styles.container}>
        {this.getHelmetNode()}
        <div className={styles.titleWrapper}>Bookmarked Papers</div>
        {this.mapPaperNode()}
        {this.getPaginationNode()}
        {this.getCitationDialog()}
      </div>
    );
  }

  private getHelmetNode = () => {
    return (
      <Helmet>
        <title>Bookmark | Sci-napse | Academic search engine for paper</title>
      </Helmet>
    );
  };

  private getPaginationNode = () => {
    const { bookmarkPage } = this.props;

    return (
      <div className={styles.paginationBox}>
        <Pagination
          type="BOOKMARK_PAGINATION"
          currentPageIndex={bookmarkPage.currentPage}
          totalPage={bookmarkPage.totalPageCount}
          onItemClick={this.fetchBookmark}
        />
      </div>
    );
  };

  private fetchBookmark = async (page = 0) => {
    const { dispatch, currentUser } = this.props;

    const bookmarkedPaperList = await dispatch(getBookmarks({ page, size: DEFAULT_BOOKMARKS_FETCHING_COUNT }));

    if (currentUser.isLoggedIn) {
      dispatch(getBookmarkedStatus(bookmarkedPaperList));
    }
  };

  private setActiveCitationDialog = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(setActiveCitationDialogPaperId(paperId));
  };

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(toggleCitationDialog());
  };

  private toggleAbstract = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(toggleAbstract(paperId));
  };

  private toggleAuthors = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(toggleAuthors(paperId));
  };

  private visitTitle = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(visitTitle(paperId));
  };

  private closeFirstOpen = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(closeFirstOpen(paperId));
  };

  private handlePostBookmark = (paper: PaperRecord) => {
    const { dispatch } = this.props;

    dispatch(postBookmark(paper));
  };

  private handleRemoveBookmark = (paper: PaperRecord) => {
    const { dispatch } = this.props;

    dispatch(removeBookmark(paper));
  };

  private handleClickCitationTab = (tab: AvailableCitationType, paperId: number) => {
    const { dispatch } = this.props;

    dispatch(handleClickCitationTab(tab));
    dispatch(getCitationText({ type: tab, paperId }));
  };

  private getCitationDialog = () => {
    const { bookmarkPage } = this.props;

    return (
      <CitationDialog
        paperId={bookmarkPage.activeCitationDialogPaperId}
        isOpen={bookmarkPage.isCitationDialogOpen}
        toggleCitationDialog={this.toggleCitationDialog}
        handleClickCitationTab={this.handleClickCitationTab}
        activeTab={bookmarkPage.activeCitationTab}
        isLoading={bookmarkPage.isFetchingCitationInformation}
        citationText={bookmarkPage.citationText}
        isFullFeature={true}
      />
    );
  };

  private mapPaperNode = () => {
    const { currentUser, bookmarks, bookmarkPage } = this.props;

    const searchItems = bookmarks.bookmarkPapers.map((paper, index) => {
      const metaItem = bookmarkPage.bookmarkItemMetaList.find(meta => meta.paperId === paper.id);

      return (
        <SearchItems
          key={`paper_${paper.id}`}
          paper={paper}
          setActiveCitationDialog={this.setActiveCitationDialog}
          toggleCitationDialog={this.toggleCitationDialog}
          isAbstractOpen={metaItem.isAbstractOpen}
          toggleAbstract={() => {
            this.toggleAbstract(paper.id);
          }}
          isAuthorsOpen={metaItem.isAuthorsOpen}
          toggleAuthors={() => {
            this.toggleAuthors(index);
          }}
          isTitleVisited={metaItem.isTitleVisited}
          visitTitle={() => {
            this.visitTitle(index);
          }}
          isBookmarked={metaItem.isBookmarked}
          isFirstOpen={metaItem.isFirstOpen}
          closeFirstOpen={() => {
            this.closeFirstOpen(index);
          }}
          handlePostBookmark={this.handlePostBookmark}
          handleRemoveBookmark={this.handleRemoveBookmark}
          searchQueryText=""
          withComments={false}
          currentUser={currentUser}
        />
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  };
}

export default connect(mapStateToProps)(withRouter(Bookmark));
