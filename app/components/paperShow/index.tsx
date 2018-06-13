import * as React from "react";
import { withRouter, RouteProps, RouteComponentProps } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import { throttle, Cancelable } from "lodash";
import * as classNames from "classnames";
import { Helmet } from "react-helmet";
import { stringify } from "qs";
import { denormalize } from "normalizr";
import { AppState } from "../../reducers";
import { withStyles } from "../../helpers/withStylesHelper";
import { CurrentUser } from "../../model/currentUser";
import ArticleSpinner from "../common/spinner/articleSpinner";
import {
  clearPaperShowState,
  postComment,
  deleteComment,
  handleClickCitationTab,
  getCitationText,
  toggleCitationDialog,
  getBookmarkedStatus,
  getComments,
  toggleAuthorBox
} from "./actions";
import { AvailableCitationType, PaperShowState } from "./records";
import AuthorList from "./components/authorList";
import RelatedPaperList from "./components/relatedPaperList";
import OtherPaperList from "./components/otherPaperList";
import PaperShowCommentInput from "./components/commentInput";
import PaperShowBookmarkButton from "./components/bookmarkButton";
import PaperShowComments from "./components/comments";
import FOSList from "./components/fosList";
import Icon from "../../icons";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import {
  trackModalView,
  trackAndOpenLink,
  trackEvent
} from "../../helpers/handleGA";
import RelatedPapers from "./components/relatedPapers";
import { Footer } from "../layouts";
import { Comment, commentSchema } from "../../model/comment";
import CitationDialog from "../common/citationDialog";
import { Configuration } from "../../reducers/configuration";
import { postBookmark, removeBookmark } from "../../actions/bookmark";
import { paperSchema, Paper } from "../../model/paper";
import {
  fetchPaperShowData,
  fetchRefPaperData,
  fetchCitedPaperData
} from "./sideEffect";
import copySelectedTextToClipboard from "../../helpers/copySelectedTextToClipboard";
import papersQueryFormatter from "../../helpers/papersQueryFormatter";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
const styles = require("./paperShow.scss");

const commonNavbarHeight = parseInt(styles.navbarHeight, 10);
const paperShowSubNavbarHeight = parseInt(styles.paperShowSubNavbarHeight, 10);
const SCROLL_TO_BUFFER = commonNavbarHeight + paperShowSubNavbarHeight + 10;

function mapStateToProps(state: AppState) {
  return {
    routing: state.routing,
    currentUser: state.currentUser,
    paperShow: state.paperShow,
    configuration: state.configuration,
    paper: denormalize(state.paperShow.paperId, paperSchema, state.entities),
    relatedPapers: denormalize(
      state.paperShow.relatedPaperIds,
      [paperSchema],
      state.entities
    ),
    otherPapers: denormalize(
      state.paperShow.otherPaperIds,
      [paperSchema],
      state.entities
    ),
    referencePapers: denormalize(
      state.paperShow.referencePaperIds,
      [paperSchema],
      state.entities
    ),
    citedPapers: denormalize(
      state.paperShow.citedPaperIds,
      [paperSchema],
      state.entities
    ),
    comments: denormalize(
      state.paperShow.commentIds,
      [commentSchema],
      state.entities
    )
  };
}

export interface PaperShowPageQueryParams {
  "ref-page"?: number;
  "cited-page"?: number;
}

export interface PaperShowMatchParams {
  paperId: string;
}

export interface PaperShowProps
  extends RouteComponentProps<PaperShowMatchParams> {
  routing: RouteProps;
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  configuration: Configuration;
  dispatch: Dispatch<any>;
  paper: Paper;
  relatedPapers: Paper[];
  otherPapers: Paper[];
  referencePapers: Paper[];
  citedPapers: Paper[];
  comments: Comment[];
}

interface PaperShowStates
  extends Readonly<{
      isBelowNavbar: boolean;
      isOnAbstractPart: boolean;
      isOnCommentsPart: boolean;
      isOnReferencesPart: boolean;
      isOnCitedPart: boolean;
    }> {}

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, PaperShowStates> {
  private handleScroll: (() => void) & Cancelable;
  private navBox: HTMLDivElement | null;
  private abstractSection: HTMLDivElement | null;
  private referencePapersWrapper: HTMLDivElement | null;
  private citedPapersWrapper: HTMLDivElement | null;
  private commentsElement: HTMLDivElement | null;

  constructor(props: PaperShowProps) {
    super(props);

    this.handleScroll = throttle(this.handleScrollEvent, 50);

    this.state = {
      isBelowNavbar: false,
      isOnAbstractPart: true,
      isOnCommentsPart: false,
      isOnReferencesPart: false,
      isOnCitedPart: false
    };
  }

  public async componentDidMount() {
    const {
      configuration,
      currentUser,
      dispatch,
      match,
      location
    } = this.props;
    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.initialFetched || configuration.clientJSRendered;

    window.addEventListener("scroll", this.handleScroll);

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      const queryParams: PaperShowPageQueryParams = getQueryParamsObject(
        location.search
      );
      await fetchPaperShowData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams
      });
      this.scrollToRelatedPapersNode();
    } else {
      const isVerifiedUser =
        currentUser &&
        currentUser.isLoggedIn &&
        (currentUser.oauthLoggedIn || currentUser.emailVerified);
      if (isVerifiedUser) {
        this.checkCurrentBookmarkedStatus();
      }
    }
  }

  public async componentDidUpdate(prevProps: PaperShowProps) {
    const { dispatch, match, location, currentUser, paper } = this.props;
    const prevQueryParams: PaperShowPageQueryParams = getQueryParamsObject(
      prevProps.location.search
    );
    const queryParams: PaperShowPageQueryParams = getQueryParamsObject(
      location.search
    );

    const authStatusChanged =
      prevProps.currentUser.isLoggedIn !== this.props.currentUser.isLoggedIn;
    const movedToDifferentPaper =
      match.params.paperId !== prevProps.match.params.paperId;
    const changeInRefPage =
      prevQueryParams["ref-page"] !== queryParams["ref-page"];
    const changeInCitedPage =
      prevQueryParams["cited-page"] !== queryParams["cited-page"];

    if (movedToDifferentPaper) {
      await fetchPaperShowData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams
      });
      this.scrollToRelatedPapersNode();
    }

    if (paper && changeInRefPage) {
      dispatch(fetchRefPaperData(paper.id, queryParams["ref-page"]));
    }

    if (paper && changeInCitedPage) {
      dispatch(fetchCitedPaperData(paper.id, queryParams["cited-page"]));
    }

    const isVerifiedUser =
      authStatusChanged &&
      (currentUser.oauthLoggedIn || currentUser.emailVerified);
    if (isVerifiedUser) {
      this.checkCurrentBookmarkedStatus();
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    window.removeEventListener("scroll", this.handleScroll);
    dispatch(clearPaperShowState());
  }

  public render() {
    const {
      paperShow,
      location,
      currentUser,
      paper,
      relatedPapers,
      otherPapers,
      referencePapers,
      citedPapers,
      comments
    } = this.props;

    if (paperShow.isLoadingPaper) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    }

    if (!paper) {
      return null;
    }

    return (
      <div className={styles.paperShowWrapper}>
        {this.getPageHelmet()}
        <div className={styles.headSection}>
          <div className={styles.container}>
            <div className={styles.innerContainer}>
              <div className={styles.leftBox}>
                <h1 className={styles.title}>{paper.title}</h1>
                {this.getJournalInformationNode()}
                {this.getDOIButton()}
                <div className={styles.authorListBox}>
                  <AuthorList
                    handleToggleAuthorBox={this.handleToggleAuthorBox}
                    isAuthorBoxExtended={paperShow.isAuthorBoxExtended}
                    authors={paper.authors}
                  />
                </div>
              </div>
              <div className={styles.rightBox} />
            </div>
          </div>
        </div>
        <div
          ref={el => (this.navBox = el)}
          className={styles.navigationBoxWrapper}
        >
          <div
            className={classNames({
              [`${styles.normalNavigationBox}`]: !this.state.isBelowNavbar,
              [`${styles.fixedNavigationBox}`]: this.state.isBelowNavbar
            })}
          >
            <div className={styles.navContainer}>
              <div
                className={classNames({
                  [`${styles.navigatorItem}`]: true,
                  [`${styles.activeItem}`]: this.state.isOnAbstractPart
                })}
                onClick={this.scrollToAbstract}
              >
                ABSTRACT
              </div>
              <div
                className={classNames({
                  [`${styles.navigatorItem}`]: true,
                  [`${styles.activeItem}`]: this.state.isOnCommentsPart
                })}
                onClick={this.scrollToComments}
              >
                {`COMMENTS (${paper.commentCount})`}
              </div>
              <div
                className={classNames({
                  [`${styles.navigatorItem}`]: true,
                  [`${styles.activeItem}`]: this.state.isOnReferencesPart
                })}
                onClick={this.scrollToReferencePapersNode}
              >
                {`REFERENCES (${paper.referenceCount})`}
              </div>
              <div
                className={classNames({
                  [`${styles.navigatorItem}`]: true,
                  [`${styles.activeItem}`]: this.state.isOnCitedPart
                })}
                onClick={this.scrollToCitedPapersNode}
              >
                {`CITED BY (${paper.citedCount})`}
              </div>

              <div className={styles.navRightBox}>
                {this.getCitationBox()}
                {this.getSourceOfPDFButton()}
                <div className={styles.bookmarkButtonBox}>
                  <PaperShowBookmarkButton
                    toggleBookmark={this.toggleBookmark}
                    isBookmarked={paperShow.isBookmarked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <div className={styles.contentLeftBox}>
              <div
                ref={el => (this.abstractSection = el)}
                className={styles.abstractBox}
              >
                <div className={styles.abstractTitle}>Abstract</div>
                <div className={styles.abstractContent}>{paper.abstract}</div>
              </div>
              <FOSList FOSList={paper.fosList} />
              <div ref={el => (this.commentsElement = el)}>
                <div className={styles.commentsBoxWrapper}>
                  <div className={styles.commentTitle}>
                    <span>Comments</span>
                    <span className={styles.commentCount}>
                      {comments.length}
                    </span>
                  </div>
                  <div className={styles.line} />
                  <PaperShowCommentInput
                    isPostingComment={paperShow.isPostingComment}
                    isFailedToPostingComment={
                      paperShow.isFailedToPostingComment
                    }
                    handlePostComment={this.handlePostComment}
                  />
                  <PaperShowComments
                    isFetchingComments={paperShow.isLoadingComments}
                    currentPageIndex={paperShow.currentCommentPage - 1}
                    commentTotalPage={paperShow.commentTotalPage}
                    fetchComments={this.fetchComments}
                    comments={comments}
                    currentUser={currentUser}
                    handleDeleteComment={this.handleDeleteComment}
                  />
                </div>
              </div>
              <div
                ref={el => (this.referencePapersWrapper = el)}
                className={`${styles.relatedTitle} ${styles.referencesTitle}`}
              >
                <span>References</span>
                <span className={styles.relatedCount}>
                  {paper.referenceCount}
                </span>
              </div>
              <RelatedPapers
                type="reference"
                papers={referencePapers}
                handleRemoveBookmark={this.handleRemoveBookmark}
                handlePostBookmark={this.handlePostBookmark}
                currentUser={currentUser}
                paperShow={paperShow}
                toggleCitationDialog={this.toggleCitationDialog}
                getLinkDestination={this.getReferencePaperPaginationLink}
                location={location}
              />
              <div
                ref={el => (this.citedPapersWrapper = el)}
                className={styles.relatedTitle}
              >
                <span>Cited by</span>
                <span className={styles.relatedCount}>{paper.citedCount}</span>
              </div>
              <RelatedPapers
                type="cited"
                papers={citedPapers}
                handleRemoveBookmark={this.handleRemoveBookmark}
                handlePostBookmark={this.handlePostBookmark}
                toggleCitationDialog={this.toggleCitationDialog}
                currentUser={currentUser}
                paperShow={paperShow}
                getLinkDestination={this.getCitedPaperPaginationLink}
                location={location}
              />
            </div>
            <div className={styles.rightBox}>
              <RelatedPaperList paperList={relatedPapers} />
              <OtherPaperList paperList={otherPapers} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  private restorationScroll = () => {
    window.scrollTo(0, 0);
  };

  private handleScrollEvent = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const navBoxTop =
      this.navBox &&
      this.navBox.getBoundingClientRect().bottom +
        window.scrollY -
        SCROLL_TO_BUFFER;
    const commentsElementTop =
      (this.commentsElement &&
        Math.floor(this.commentsElement.getBoundingClientRect().top) +
          window.scrollY -
          SCROLL_TO_BUFFER) ||
      0;
    const referencePapersWrapperTop =
      (this.referencePapersWrapper &&
        Math.floor(this.referencePapersWrapper.getBoundingClientRect().top) +
          window.scrollY -
          SCROLL_TO_BUFFER) ||
      0;
    const citedPapersWrapperTop =
      (this.citedPapersWrapper &&
        Math.floor(this.citedPapersWrapper.getBoundingClientRect().top) +
          window.scrollY -
          SCROLL_TO_BUFFER) ||
      0;

    if (scrollTop > (navBoxTop || 0) && !this.state.isBelowNavbar) {
      this.setState({
        isBelowNavbar: true
      });
    } else if (scrollTop <= (navBoxTop || 0) && this.state.isBelowNavbar) {
      this.setState({
        isBelowNavbar: false
      });
    }

    if (scrollTop === 0 || scrollTop < commentsElementTop) {
      return this.setState({
        isOnAbstractPart: true,
        isOnCommentsPart: false,
        isOnReferencesPart: false,
        isOnCitedPart: false
      });
    } else if (
      scrollTop >= commentsElementTop &&
      scrollTop < referencePapersWrapperTop
    ) {
      return this.setState({
        isOnAbstractPart: false,
        isOnCommentsPart: true,
        isOnReferencesPart: false,
        isOnCitedPart: false
      });
    } else if (
      scrollTop >= referencePapersWrapperTop &&
      scrollTop < citedPapersWrapperTop
    ) {
      return this.setState({
        isOnAbstractPart: false,
        isOnCommentsPart: false,
        isOnReferencesPart: true,
        isOnCitedPart: false
      });
    } else {
      return this.setState({
        isOnAbstractPart: false,
        isOnCommentsPart: false,
        isOnReferencesPart: false,
        isOnCitedPart: true
      });
    }
  };

  private handleToggleAuthorBox = () => {
    const { dispatch } = this.props;

    dispatch(toggleAuthorBox());
  };

  private toggleCitationDialog = () => {
    const { dispatch, paperShow } = this.props;

    const isFirstOpen =
      !paperShow.citationText && !paperShow.isCitationDialogOpen;
    if (isFirstOpen) {
      this.handleClickCitationTab(paperShow.activeCitationTab);
    }

    dispatch(toggleCitationDialog());
  };

  private checkCurrentBookmarkedStatus = () => {
    const { dispatch, paper, currentUser } = this.props;

    if (paper && currentUser.isLoggedIn) {
      dispatch(getBookmarkedStatus(paper));
    }
  };

  private toggleBookmark = () => {
    const { paperShow, paper } = this.props;

    if (!paper) {
      return;
    }

    if (paperShow.isBookmarked) {
      this.handleRemoveBookmark(paper);
      trackEvent({
        category: "paper-show",
        action: "remove-bookmark",
        label: `${paper.id}`
      });
    } else {
      this.handlePostBookmark(paper);
      trackEvent({
        category: "paper-show",
        action: "active-bookmark",
        label: `${paper.id}`
      });
    }
  };

  private getCitedPaperPaginationLink = (page: number) => {
    const { paper, location } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(
      location.search
    );

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...{ "cited-page": page }
    };
    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true
    });

    return {
      to: `/papers/${paper ? paper.id : 0}`,
      search: stringifiedQueryParams
    };
  };

  private getReferencePaperPaginationLink = (page: number) => {
    const { paper, location } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(
      location.search
    );

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...{ "ref-page": page }
    };
    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true
    });

    return {
      to: `/papers/${paper ? paper.id : 0}`,
      search: stringifiedQueryParams
    };
  };

  private scrollToAbstract = () => {
    const targetHeight =
      (this.abstractSection &&
        this.abstractSection.getBoundingClientRect().top + window.scrollY) ||
      0;
    window.scrollTo(0, targetHeight - SCROLL_TO_BUFFER);
  };

  private scrollToComments = () => {
    const targetHeight =
      (this.commentsElement &&
        this.commentsElement.getBoundingClientRect().top + window.scrollY) ||
      0;
    window.scrollTo(0, targetHeight - SCROLL_TO_BUFFER);
  };

  private scrollToCitedPapersNode = () => {
    const targetHeight =
      (this.citedPapersWrapper &&
        this.citedPapersWrapper.getBoundingClientRect().top + window.scrollY) ||
      0;
    window.scrollTo(0, targetHeight - SCROLL_TO_BUFFER);
  };

  private scrollToReferencePapersNode = () => {
    const targetHeight =
      (this.referencePapersWrapper &&
        this.referencePapersWrapper.getBoundingClientRect().top +
          window.scrollY) ||
      0;
    window.scrollTo(0, targetHeight - SCROLL_TO_BUFFER);
  };

  private scrollToRelatedPapersNode = () => {
    const { location } = this.props;

    if (location.hash === "#cited") {
      this.scrollToCitedPapersNode();
    } else if (location.hash === "#references") {
      this.scrollToReferencePapersNode();
    } else {
      this.restorationScroll();
    }
  };

  private handlePostBookmark = (paper: Paper) => {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.isLoggedIn) {
      return checkAuthDialog();
    }

    const hasRightToPostComment =
      currentUser.oauthLoggedIn || currentUser.emailVerified;

    if (!hasRightToPostComment) {
      return dispatch(openVerificationNeeded());
    }

    dispatch(postBookmark(paper));
  };

  private handleRemoveBookmark = (paper: Paper) => {
    const { dispatch, currentUser } = this.props;

    if (!currentUser.isLoggedIn) {
      checkAuthDialog();
    }

    const hasRightToPostComment =
      currentUser.oauthLoggedIn || currentUser.emailVerified;

    if (!hasRightToPostComment) {
      return dispatch(openVerificationNeeded());
    }

    dispatch(removeBookmark(paper));
  };

  private getCitationBox = () => {
    const { paper, paperShow } = this.props;

    if (paper && paper.doi) {
      return (
        <div
          onClick={this.toggleCitationDialog}
          className={styles.citationButton}
        >
          <div>CITE THIS PAPER</div>
          <CitationDialog
            paperId={paper.id}
            isOpen={paperShow.isCitationDialogOpen}
            toggleCitationDialog={this.toggleCitationDialog}
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

  private getDOIButton = () => {
    const { paper } = this.props;

    if (paper && paper.doi) {
      return (
        <button onClick={this.clickDOIButton} className={styles.DOIButton}>
          <span className={styles.informationSubtitle}>DOI</span>
          <span>{` | ${paper.doi}`}</span>
        </button>
      );
    } else {
      return null;
    }
  };

  private clickDOIButton = () => {
    const { paper } = this.props;

    if (paper) {
      copySelectedTextToClipboard(`https://dx.doi.org/${paper.doi}`);
      trackEvent({
        category: "paper-show",
        action: "copy-DOI",
        label: paper.id.toString()
      });
    }
  };

  private handleClickCitationTab = (tab: AvailableCitationType) => {
    const { dispatch, paper } = this.props;

    dispatch(handleClickCitationTab(tab));
    dispatch(getCitationText({ type: tab, paperId: paper ? paper.id : 0 }));
    trackEvent({
      category: "paper-show",
      action: "click-citation-tab",
      label: AvailableCitationType[tab]
    });
  };

  private getSourceOfPDFButton = () => {
    const { paper } = this.props;

    if (!paper) {
      return null;
    }

    const pdfSourceRecord =
      paper.urls &&
      paper.urls.find(paperSource => {
        if (paperSource && paperSource.url) {
          return paperSource.url.includes(".pdf");
        } else {
          return false;
        }
      });

    if (pdfSourceRecord) {
      return (
        <a
          onClick={this.handleClickPDFButton}
          className={styles.pdfOrSourceButtonWrapper}
          href={pdfSourceRecord.url}
          target="_blank"
        >
          <Icon className={styles.sourceIcon} icon="DOWNLOAD" />
          <span>DOWNLOAD PDF</span>
        </a>
      );
    } else {
      let source: string;
      if (paper.doi) {
        source = `https://dx.doi.org/${paper.doi}`;
      } else if (paper.urls && paper.urls[0]) {
        source = paper.urls[0].url;
      } else {
        source = "";
      }

      if (source && source.length > 0) {
        return (
          <a
            className={styles.pdfOrSourceButtonWrapper}
            href={source}
            onClick={() => {
              trackAndOpenLink("View In Source(paperShow)");
            }}
            target="_blank"
          >
            <Icon className={styles.sourceIcon} icon="EXTERNAL_SOURCE" />
            <span>VIEW IN SOURCE</span>
          </a>
        );
      }
    }
  };

  private buildPageDescription = () => {
    const { paper } = this.props;

    if (!paper) {
      return "sci-napse";
    }
    const shortAbstract = paper.abstract
      ? `${paper.abstract.slice(0, 50)} | `
      : "";
    const shortAuthors =
      paper.authors && paper.authors.length > 0
        ? `${paper.authors
            .map(author => {
              return author!.name;
            })
            .join(", ")
            .slice(0, 50)}  | `
        : "";
    const shortJournals = paper.journal
      ? `${paper.journal!.fullTitle!.slice(0, 50)} | `
      : "";

    return `${shortAbstract}${shortAuthors}${shortJournals} | sci-napse`;
  };

  private makeStructuredData = (paper: Paper) => {
    const authorsForStructuredData = paper.authors.map(author => {
      return {
        "@type": "Person",
        name: author!.name,
        affiliation: {
          name: author!.organization
        }
      };
    });

    const structuredData: any = {
      "@context": "http://schema.org",
      "@type": "Article",
      headline: paper.title,
      image: [],
      datePublished: paper.year,
      author: authorsForStructuredData,
      keywords: paper.fosList.map(fos => fos!.fos),
      publisher: {
        "@type": "Organization",
        name: paper.publisher
      },
      description: paper.abstract,
      mainEntityOfPage: "https://scinapse.io"
    };

    return structuredData;
  };

  private handleClickPDFButton = () => {
    const { paper } = this.props;

    if (paper) {
      trackEvent({
        category: "paper-show",
        action: "click-pdf-button",
        label: `${paper.id}`
      });
    }
  };

  private getPageHelmet = () => {
    const { paper } = this.props;

    if (paper) {
      return (
        <Helmet>
          <title>
            {paper.title} | Sci-napse | Academic search engine for paper
          </title>
          <meta
            itemProp="name"
            content={`${
              paper.title
            } | Sci-napse | Academic search engine for paper`}
          />
          <meta name="description" content={this.buildPageDescription()} />
          <meta
            name="twitter:description"
            content={this.buildPageDescription()}
          />
          <meta
            name="twitter:card"
            content={`${
              paper.title
            } | Sci-napse | Academic search engine for paper`}
          />
          <meta
            name="twitter:title"
            content={`${
              paper.title
            } | Sci-napse | Academic search engine for paper`}
          />
          <meta
            property="og:title"
            content={`${
              paper.title
            } | Sci-napse | Academic search engine for paper`}
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content={`https://scinapse.io/papers/${paper.id}`}
          />
          <meta
            property="og:description"
            content={this.buildPageDescription()}
          />

          <script type="application/ld+json">
            {JSON.stringify(this.makeStructuredData(paper))}
          </script>
        </Helmet>
      );
    }
  };

  private getJournalInformationNode = () => {
    const { paper } = this.props;

    if (!paper || !paper.journal) {
      return null;
    } else {
      const { journal } = paper;

      return (
        <div className={styles.journalInformation}>
          <span className={styles.informationSubtitle}>PUBLISHED</span>
          <span>{` | ${paper.year} in `}</span>
          <a
            className={styles.journalLink}
            href={`/search?${papersQueryFormatter.stringifyPapersQuery({
              query: journal.fullTitle || paper.venue,
              sort: "RELEVANCE",
              page: 1,
              filter: {}
            })}`}
            target="_blank"
          >
            {`${journal.fullTitle || paper.venue}`}
          </a>
          <span>
            {journal.impactFactor
              ? ` [IF: ${journal.impactFactor.toFixed(2)}]`
              : ""}
          </span>
        </div>
      );
    }
  };

  private handlePostComment = async (commentContent: string) => {
    const { dispatch, paper, currentUser } = this.props;
    const trimmedComment = commentContent.trim();

    checkAuthDialog();

    if (paper && currentUser.isLoggedIn) {
      const hasRightToPostComment =
        currentUser.oauthLoggedIn || currentUser.emailVerified;

      if (!hasRightToPostComment) {
        dispatch(openVerificationNeeded());
        trackModalView("postCommentVerificationNeededOpen");
        throw new Error("Not verified user.");
      } else if (trimmedComment.length > 0) {
        await dispatch(
          postComment({
            paperId: paper.id,
            cognitivePaperId: paper.cognitivePaperId,
            comment: trimmedComment
          })
        );
      }
    } else {
      throw new Error("Can't post comment in current environment.");
    }
  };

  private handleDeleteComment = (comment: Comment) => {
    const { dispatch, paper, currentUser } = this.props;

    checkAuthDialog();

    if (paper && currentUser.isLoggedIn) {
      const hasRightToDeleteComment =
        (currentUser.oauthLoggedIn || currentUser.emailVerified) &&
        comment.createdBy!.id === currentUser.id;

      if (!hasRightToDeleteComment) {
        dispatch(openVerificationNeeded());
        trackModalView("deleteCommentVerificationNeededOpen");
      } else {
        dispatch(
          deleteComment({
            paperId: paper.id,
            commentId: comment.id
          })
        );
      }
    }
  };

  private fetchComments = (pageIndex: number = 0) => {
    const { paper, dispatch } = this.props;

    if (paper) {
      dispatch(getComments({ paperId: paper.id, page: pageIndex + 1 }));
    }
  };
}

export default connect(mapStateToProps)(withRouter(PaperShow));
