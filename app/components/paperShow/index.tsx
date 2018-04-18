import * as React from "react";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as classNames from "classnames";
import { Helmet } from "react-helmet";
import { push } from "react-router-redux";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUserRecord } from "../../model/currentUser";
import { LoadDataParams } from "../../routes";
import ArticleSpinner from "../common/spinner/articleSpinner";
import {
  clearPaperShowState,
  changeCommentInput,
  postComment,
  toggleAbstract,
  toggleAuthors,
  visitTitle,
  closeFirstOpen,
  deleteComment,
  handleClickCitationTab,
  getCitationText,
  toggleCitationDialog,
  getBookmarkedStatus,
  getComments,
  getReferencePapers,
  getCitedPapers,
} from "./actions";
import { PaperShowStateRecord, AvailableCitationType } from "./records";
import CitationBox from "./components/citationBox";
import PostAuthor from "./components/author";
import PaperShowComments from "./components/comments";
import PaperShowKeyword from "./components/keyword";
import DOIButton from "../articleSearch/components/searchItem/doiButton";
import { IPaperSourceRecord } from "../../model/paperSource";
import Icon from "../../icons";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import { trackModalView, trackAndOpenLink, trackEvent } from "../../helpers/handleGA";
import RelatedPapers from "./components/relatedPapers";
import EnvChecker from "../../helpers/envChecker";
import { Footer } from "../layouts";
import { ICommentRecord } from "../../model/comment";
import CitationDialog from "../common/citationDialog";
import { ConfigurationRecord } from "../../reducers/configuration";
import { postBookmark, removeBookmark, getBookmarkedStatus as getBookmarkedStatusList } from "../../actions/bookmark";
import { PaperRecord } from "../../model/paper";
import { fetchPaperShowData } from "./sideEffect";
import { RELATED_PAPERS } from "./constants";
const styles = require("./paperShow.scss");

export interface GetPaginationDataParams extends LoadDataParams {
  paperId?: number;
  page?: number;
}

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
    paperShow: state.paperShow,
    configuration: state.configuration,
  };
}

export interface PaperShowMappedState {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
  configuration: ConfigurationRecord;
}

export interface PaperShowProps extends DispatchProp<PaperShowMappedState>, RouteComponentProps<{ paperId: string }> {
  routing: RouteProps;
  currentUser: CurrentUserRecord;
  paperShow: PaperShowStateRecord;
  configuration: ConfigurationRecord;
}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, {}> {
  private referencePapersWrapper: HTMLDivElement;
  private citedPapersWrapper: HTMLDivElement;
  private commentElement: HTMLDivElement;

  public async componentDidMount() {
    const { configuration, currentUser, dispatch, match, location } = this.props;
    const notRenderedAtServer = !configuration.initialFetched || configuration.clientJSRendered;

    if (notRenderedAtServer) {
      // TODO: Get page from queryParams
      await fetchPaperShowData({ dispatch, match, pathname: location.pathname }, currentUser);
      this.scrollToRelatedPapersNode();
    } else {
      if (currentUser && currentUser.isLoggedIn) {
        this.checkCurrentBookmarkedStatus();
      }
    }
  }

  public async componentDidUpdate(prevProps: PaperShowProps) {
    const { dispatch, match, location, currentUser, paperShow } = this.props;

    const authStatusChanged = prevProps.currentUser.isLoggedIn !== this.props.currentUser.isLoggedIn;
    const movedToDifferentPaper = match.params.paperId !== prevProps.match.params.paperId;
    const movedToDifferentReferencePapersTab =
      !movedToDifferentPaper && prevProps.location.pathname !== this.props.location.pathname;
    const referencePaperPageIsChanged =
      paperShow.referencePaperCurrentPage !== prevProps.paperShow.referencePaperCurrentPage;

    if (movedToDifferentPaper) {
      await fetchPaperShowData({ dispatch, match, pathname: location.pathname }, currentUser);
      this.scrollToRelatedPapersNode();
    } else if (movedToDifferentReferencePapersTab) {
      this.fetchRelatedPapers();
    }

    if (currentUser && currentUser.isLoggedIn && (referencePaperPageIsChanged || authStatusChanged)) {
      this.checkCurrentBookmarkedStatus();
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(clearPaperShowState());
  }

  public render() {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (paperShow.isLoadingPaper) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

    if (!paper || paper.isEmpty()) {
      return null;
    }

    return (
      <div className={styles.paperShowWrapper}>
        {this.getPageHelmet()}
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            {this.getLeftBox()}
            <div className={styles.rightBox}>
              {this.getSourceButton()}
              {this.getPDFDownloadButton()}
              {this.getCommentButton()}
              {this.getBookmarkButton()}
              {this.getCitationBox()}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  private getLeftBox = () => {
    const { paperShow, currentUser, location } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.leftBox}>
        <h1 className={styles.title}>{paper.title}</h1>
        {this.getAuthors()}
        {this.getJournalInformationNode()}
        {this.getDOIButton()}
        <div className={styles.separateLine} />
        {this.getAbstract()}
        {this.getKeywordNode()}
        <div ref={el => (this.commentElement = el)}>
          <PaperShowComments
            commentsCount={paper.commentCount}
            isFetchingComments={paperShow.isLoadingComments}
            commentInput={paperShow.commentInput}
            currentCommentPage={paperShow.currentCommentPage}
            commentTotalPage={paperShow.commentTotalPage}
            isPostingComment={paperShow.isPostingComment}
            isFailedToPostingComment={paperShow.isFailedToPostingComment}
            handlePostComment={this.handlePostComment}
            handleChangeCommentInput={this.handleChangeCommentInput}
            fetchComments={this.fetchComments}
            comments={paperShow.comments}
            currentUser={currentUser}
            handleDeleteComment={this.handleDeleteComment}
          />
        </div>
        {this.getTabs()}
        <div className={styles.routesContainer}>
          <div ref={el => (this.referencePapersWrapper = el)}>
            <div className={styles.relatedTitle}>
              <span>References</span>
              <span className={styles.relatedCount}>{paper.referenceCount}</span>
            </div>
            <RelatedPapers
              type="reference"
              handleRemoveBookmark={this.handleRemoveBookmark}
              handlePostBookmark={this.handlePostBookmark}
              currentUser={currentUser}
              paperShow={paperShow}
              toggleCitationDialog={this.toggleCitationDialog}
              handleClickPagination={this.handleClickReferencePapersPagination}
              toggleAbstract={this.toggleAbstract}
              toggleAuthors={this.toggleAuthors}
              closeFirstOpen={this.closeFirstOpen}
              visitTitle={this.visitTitle}
              location={location}
            />
          </div>
          <div ref={el => (this.citedPapersWrapper = el)}>
            <div className={styles.relatedTitle}>
              <span>Cited by</span>
              <span className={styles.relatedCount}>{paper.citedCount}</span>
            </div>
            <RelatedPapers
              type="cited"
              handleRemoveBookmark={this.handleRemoveBookmark}
              handlePostBookmark={this.handlePostBookmark}
              toggleCitationDialog={this.toggleCitationDialog}
              currentUser={currentUser}
              paperShow={paperShow}
              handleClickPagination={this.handleClickCitedPapersPagination}
              toggleAbstract={this.toggleAbstract}
              toggleAuthors={this.toggleAuthors}
              closeFirstOpen={this.closeFirstOpen}
              visitTitle={this.visitTitle}
              location={location}
            />
          </div>
        </div>
      </div>
    );
  };

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(toggleCitationDialog());
  };

  private checkCurrentBookmarkedStatus = () => {
    const { dispatch, paperShow, currentUser } = this.props;

    if (paperShow.paper && currentUser.isLoggedIn) {
      dispatch(getBookmarkedStatus(paperShow.paper));

      if (paperShow.referencePapers && !paperShow.referencePapers.isEmpty()) {
        dispatch(getBookmarkedStatusList(paperShow.referencePapers));
      }
    }
  };

  private getBookmarkButton = () => {
    const { paperShow } = this.props;

    if (paperShow.isBookmarked) {
      return (
        <a
          onClick={() => {
            this.handleRemoveBookmark(paperShow.paper);
            trackEvent({ category: "paper-show", action: "remove-bookmark", label: `${paperShow.paper.id}` });
          }}
          className={styles.activeBookmarkButton}
        >
          <Icon icon="BOOKMARK_GRAY" className={styles.bookmarkButtonIcon} />
          <span>Bookmarked</span>
        </a>
      );
    } else {
      return (
        <a
          onClick={() => {
            this.handlePostBookmark(paperShow.paper);
            trackEvent({ category: "paper-show", action: "active-bookmark", label: `${paperShow.paper.id}` });
          }}
          className={styles.bookmarkButton}
        >
          <Icon icon="BOOKMARK_GRAY" className={styles.bookmarkButtonIcon} />
          <span>Bookmark</span>
        </a>
      );
    }
  };

  private handleClickCitedPapersPagination = async (pageIndex: number) => {
    await this.fetchCitedPapers(pageIndex);
    this.scrollToCitedPapersNode();
  };

  private handleClickReferencePapersPagination = async (pageIndex: number) => {
    await this.fetchReferencePapers(pageIndex);
    this.scrollToReferencePapersNode();
  };

  private scrollToCitedPapersNode = () => {
    if (!EnvChecker.isServer) {
      const targetHeight = this.citedPapersWrapper && this.citedPapersWrapper.offsetTop;
      window.scrollTo(0, targetHeight);
    }
  };

  private scrollToReferencePapersNode = () => {
    if (!EnvChecker.isServer) {
      const targetHeight = this.referencePapersWrapper && this.referencePapersWrapper.offsetTop;
      window.scrollTo(0, targetHeight);
    }
  };

  private scrollToRelatedPapersNode = () => {
    const { location } = this.props;

    if (location.hash === "cited") {
      this.scrollToCitedPapersNode();
    } else {
      this.scrollToReferencePapersNode();
    }
  };

  private handlePostBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      dispatch(postBookmark(paper));
    }
  };

  private handleRemoveBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      dispatch(removeBookmark(paper));
    }
  };

  private getCitationBox = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (paper.doi) {
      return (
        <div>
          <CitationBox
            paperId={paper.id}
            toggleCitationDialog={this.toggleCitationDialog}
            handleClickCitationTab={this.handleClickCitationTab}
            activeTab={paperShow.activeCitationTab}
            isLoading={paperShow.isFetchingCitationInformation}
            citationText={paperShow.citationText}
            isFullFeature={false}
          />
          <CitationDialog
            paperId={paper.id}
            isOpen={paperShow.isCitationDialogOpen}
            toggleCitationDialog={this.toggleCitationDialog}
            isFullFeature={true}
            handleClickCitationTab={this.handleClickCitationTab}
            activeTab={paperShow.activeCitationTab}
            isLoading={paperShow.isFetchingCitationInformation}
            citationText={paperShow.citationText}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  private getSourceButton = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    const source = paper.doi ? `https://dx.doi.org/${paper.doi}` : paper.urls.getIn([0, "url"]);

    if (source) {
      return (
        <a
          className={styles.pdfButtonWrapper}
          href={source}
          onClick={() => {
            trackAndOpenLink("View In Source(paperShow)");
          }}
          target="_blank"
        >
          <Icon className={styles.sourceIcon} icon="SOURCE_LINK" />
          <span>View in source</span>
        </a>
      );
    } else {
      return null;
    }
  };

  private getDOIButton = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    if (paper.doi) {
      return (
        <DOIButton
          style={{
            display: "inline-block",
            verticalAlign: "top",
            lineHeight: "1.3",
            borderRadius: "5px",
            border: "solid 1px #e7eaf2",
            fontSize: "15px",
          }}
          DOI={paper.doi}
          trackEventParams={{ category: "paper-show", action: "copy-DOI", label: paper.id.toString() }}
        />
      );
    } else {
      return null;
    }
  };

  private toggleAuthors = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(toggleAuthors(paperId, relatedPapersType));
  };

  private toggleAbstract = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(toggleAbstract(paperId, relatedPapersType));
  };

  private handleClickCitationTab = (tab: AvailableCitationType) => {
    const { dispatch, paperShow } = this.props;

    dispatch(handleClickCitationTab(tab));
    dispatch(getCitationText({ type: tab, paperId: paperShow.paper.id }));
    trackEvent({ category: "paper-show", action: "click-citation-tab", label: AvailableCitationType[tab] });
  };

  private visitTitle = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(visitTitle(paperId, relatedPapersType));
  };

  private handleClickLeaveCommentButton = () => {
    const { dispatch, location, match } = this.props;
    if (!EnvChecker.isServer()) {
      if (location.pathname !== match.url) {
        dispatch(push(match.url));
      }
      const targetTopScrollHeight = this.commentElement && this.commentElement.offsetTop;
      window.scrollTo(0, targetTopScrollHeight);
    }
  };

  private closeFirstOpen = (paperId: number, relatedPapersType: RELATED_PAPERS) => {
    const { dispatch } = this.props;

    dispatch(closeFirstOpen(paperId, relatedPapersType));
  };

  private getTabs = () => {
    const { paperShow, match, location } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.tabWrapper}>
        <span
          onClick={this.scrollToReferencePapersNode}
          className={classNames({
            [`${styles.tabButton}`]: true,
            [`${styles.activeTab}`]: location.pathname === match.url || location.pathname.search(/\/ref$/) > 0,
          })}
        >
          {`References (${paper.referenceCount})`}
        </span>
        <span
          onClick={this.scrollToCitedPapersNode}
          className={classNames({
            [`${styles.tabButton}`]: true,
            [`${styles.activeTab}`]: location.pathname.search(/\/cited$/) > 0,
          })}
        >
          {`Cited by (${paper.citedCount})`}
        </span>
      </div>
    );
  };

  private fetchCitedPapers = async (page = 0) => {
    const { match, dispatch, paperShow } = this.props;
    const targetPaperId = paperShow.paper ? paperShow.paper.id : parseInt(match.params.paperId, 10);

    await dispatch(
      getCitedPapers({
        paperId: paperShow.paper.id,
        page,
        filter: "year=:,if=:",
      }),
    );

    trackEvent({ category: "paper-show", action: "fetch-cited-papers", label: `${targetPaperId} - ${page}` });
  };

  private fetchReferencePapers = async (page = 0) => {
    const { dispatch, paperShow, match } = this.props;
    const targetPaperId = paperShow.paper ? paperShow.paper.id : parseInt(match.params.paperId, 10);

    await dispatch(
      getReferencePapers({
        paperId: paperShow.paper.id,
        page,
        filter: "year=:,if=:",
      }),
    );

    trackEvent({ category: "paper-show", action: "fetch-refs-papers", label: `${targetPaperId} - ${page}` });
  };

  private fetchRelatedPapers = async () => {
    await this.fetchCitedPapers();
    await this.fetchReferencePapers();
  };

  private getCommentButton = () => {
    return (
      <a
        onClick={() => {
          this.handleClickLeaveCommentButton();
          trackEvent({ category: "paper-show", action: "click leave a comment button", label: "" });
        }}
        className={styles.commentButton}
      >
        Leave a comment
      </a>
    );
  };

  private getPDFDownloadButton = () => {
    const { paperShow } = this.props;

    const pdfSourceRecord = paperShow.paper.urls.find((paperSource: IPaperSourceRecord) => {
      return paperSource.url.includes(".pdf");
    });

    if (pdfSourceRecord) {
      return (
        <a className={styles.pdfButtonWrapper} href={pdfSourceRecord.url} target="_blank">
          <Icon className={styles.pdfIconWrapper} icon="PDF_ICON" />
          <span>View PDF</span>
        </a>
      );
    } else {
      return null;
    }
  };

  private getKeywordNode = () => {
    const { paperShow } = this.props;

    if (!paperShow.paper.fosList || paperShow.paper.fosList.isEmpty()) {
      return null;
    } else {
      const keywordNodes = paperShow.paper.fosList.map((fos, index) => {
        return <PaperShowKeyword fos={fos} key={`${fos.fos}_${index}}`} />;
      });

      return (
        <div className={styles.keywordBox}>
          <div className={styles.keywordTitle}>Keyword</div>
          {keywordNodes}
        </div>
      );
    }
  };

  private getAbstract = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    return (
      <div className={styles.abstractBox}>
        <div className={styles.abstractTitle}>Abstract</div>
        <div className={styles.abstractContent}>{paper.abstract}</div>
      </div>
    );
  };

  private getAuthors = () => {
    const { paperShow } = this.props;

    const authors = paperShow.paper.authors.map((author, index) => {
      return <PostAuthor author={author} key={`${paperShow.paper.title}_${author.name}_${index}`} />;
    });

    return (
      <div className={styles.authorBox}>
        <span className={styles.subInformationIconWrapper}>
          <Icon className={styles.subInformationIcon} icon="AUTHOR" />
        </span>
        {authors}
      </div>
    );
  };

  private buildPageDescription = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    const shortAbstract = paper.abstract ? `${paper.abstract.slice(0, 50)} | ` : "";
    const shortAuthors =
      paper.authors && !paper.authors.isEmpty()
        ? `${paper.authors
            .map(author => author.name)
            .join(", ")
            .slice(0, 50)}  | `
        : "";
    const shortJournals = paper.journal && !paper.journal.isEmpty ? `${paper.journal.fullTitle.slice(0, 50)} | ` : "";

    return `${shortAbstract}${shortAuthors}${shortJournals} | sci-napse`;
  };

  private makeStructuredData = (paper: PaperRecord) => {
    const authorsForStructuredData = paper.authors.map(author => {
      return {
        "@type": "Person",
        name: author.name,
        affiliation: {
          name: author.organization,
        },
      };
    });

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "Article",
      headline: paper.title,
      image: [],
      datePublished: paper.year,
      author: authorsForStructuredData,
      keywords: paper.fosList.map(fos => fos.fos),
      publisher: {
        "@type": "Organization",
        name: paper.publisher,
      },
      description: paper.abstract,
      mainEntityOfPage: "https://scinapse.io",
    };

    return structuredData;
  };

  private getPageHelmet = () => {
    const { paperShow } = this.props;
    const { paper } = paperShow;

    return (
      <Helmet>
        <title>{paper.title} | Sci-napse | Academic search engine for paper</title>
        <meta name="description" content={this.buildPageDescription()} />
        <meta itemProp="description" content={this.buildPageDescription()} />
        <meta name="twitter:description" content={this.buildPageDescription()} />
        <script type="application/ld+json">{JSON.stringify(this.makeStructuredData(paper))}</script>
      </Helmet>
    );
  };

  private getJournalInformationNode = () => {
    const { paperShow } = this.props;
    const { journal } = paperShow.paper;

    if (!journal) {
      return null;
    } else {
      return (
        <div className={styles.journalInformation}>
          <span className={styles.subInformationIconWrapper}>
            <Icon className={styles.subInformationIcon} icon="JOURNAL" />
          </span>
          {`Published ${paperShow.paper.year} in ${journal.fullTitle || paperShow.paper.venue}`}
          <span>{journal.impactFactor ? ` [IF: ${journal.impactFactor}]` : ""}</span>
        </div>
      );
    }
  };

  private handleChangeCommentInput = (comment: string) => {
    const { dispatch } = this.props;

    dispatch(changeCommentInput(comment));
  };

  private handlePostComment = () => {
    const { dispatch, paperShow, currentUser } = this.props;
    const trimmedComment = paperShow.commentInput.trim();

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      const hasRightToPostComment = currentUser.oauthLoggedIn || currentUser.emailVerified;

      if (!hasRightToPostComment) {
        dispatch(openVerificationNeeded());
        trackModalView("postCommentVerificationNeededOpen");
      } else if (trimmedComment.length > 0) {
        dispatch(
          postComment({
            paperId: paperShow.paper.id,
            cognitivePaperId: paperShow.paper.cognitivePaperId,
            comment: trimmedComment,
          }),
        );
      }
    }
  };

  private handleDeleteComment = (comment: ICommentRecord) => {
    const { dispatch, paperShow, currentUser } = this.props;

    checkAuthDialog();

    if (currentUser.isLoggedIn) {
      const hasRightToDeleteComment =
        (currentUser.oauthLoggedIn || currentUser.emailVerified) && comment.createdBy.id === currentUser.id;

      if (!hasRightToDeleteComment) {
        dispatch(openVerificationNeeded());
        trackModalView("deleteCommentVerificationNeededOpen");
      } else {
        dispatch(
          deleteComment({
            paperId: paperShow.paper.id,
            commentId: comment.id,
          }),
        );
      }
    }
  };

  private fetchComments = (pageIndex: number = 0) => {
    const { dispatch, paperShow } = this.props;

    dispatch(getComments({ paperId: paperShow.paper.id, page: pageIndex }));
  };
}

export default connect(mapStateToProps)(withRouter(PaperShow));
