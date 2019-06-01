import * as React from 'react';
import axios from 'axios';
import { stringify } from 'qs';
import NoSsr from '@material-ui/core/NoSsr';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect, Dispatch } from 'react-redux';
import PDFViewer from '../../components/pdfViewer';
import { AppState } from '../../reducers';
import { withStyles } from '../../helpers/withStylesHelper';
import { CurrentUser } from '../../model/currentUser';
import ArticleSpinner from '../../components/common/spinner/articleSpinner';
import { clearPaperShowState } from '../../actions/paperShow';
import { PaperShowState } from './records';
import ActionBar from '../paperShowActionBar';
import FOSList from '../../components/paperShow/components/fosList';
import ReferencePapers from '../../components/paperShow/components/relatedPapers';
import PaperShowRefCitedTab from '../../components/paperShow/refCitedTab';
import { Footer } from '../../components/layouts';
import { Paper } from '../../model/paper';
import { fetchCitedPaperData, fetchMyCollection, fetchPaperShowData, fetchRefPaperData } from './sideEffect';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { LayoutState, UserDevice } from '../../components/layouts/records';
import { getMemoizedPaper } from './select';
import { formulaeToHTMLStr } from '../../helpers/displayFormula';
import restoreScroll from '../../helpers/scrollRestoration';
import ErrorPage from '../../components/error/errorPage';
import EnvChecker from '../../helpers/envChecker';
import NextPaperTab from '../nextPaperTab';
import { PaperShowMatchParams, PaperShowPageQueryParams, RefCitedTabItem } from './types';
import VenueAndAuthors from '../../components/common/paperItem/venueAndAuthors';
import ActionTicketManager from '../../helpers/actionTicketManager';
import RelatedPapers from '../../components/relatedPapers';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { RELATED_PAPERS_AT_PAPER_SHOW_TEST, SIGN_BANNER_AT_PAPER_SHOW_TEST } from '../../constants/abTestGlobalValue';
import { CommonError } from '../../model/error';
import PaperShowHelmet from '../../components/paperShow/helmet';
import GoBackResultBtn from '../../components/paperShow/backButton';
import { getMemoizedCurrentUser } from '../../selectors/getCurrentUser';
import { getRelatedPapers } from '../../actions/relatedPapers';
import {
  makeGetMemoizedPapers,
  getMemoizedReferencePaperIds,
  getMemoizedCitedPaperIds,
} from '../../selectors/papersSelector';
import { getMemoizedPaperShow } from '../../selectors/getPaperShow';
import { getMemoizedLayout } from '../../selectors/getLayout';
import { getMemoizedPDFViewerState } from '../../selectors/getPDFViewer';
import { PDFViewerState } from '../../reducers/pdfViewer';
import { ActionCreators } from '../../actions/actionTypes';
import BottomBanner from '../../components/preNoted/bottomBanner';
import { Configuration } from '../../reducers/configuration';
import { getMemoizedConfiguration } from '../../selectors/getConfiguration';
import SearchFullScrollBanner from '../../components/paperShow/searchFullBanner';
const styles = require('./paperShow.scss');

const NAVBAR_HEIGHT = parseInt(styles.navbarHeight, 10) + 1;
let ticking = false;

const getReferencePapers = makeGetMemoizedPapers(getMemoizedReferencePaperIds);
const getCitedPapers = makeGetMemoizedPapers(getMemoizedCitedPaperIds);

function mapStateToProps(state: AppState) {
  return {
    layout: getMemoizedLayout(state),
    configuration: getMemoizedConfiguration(state),
    currentUser: getMemoizedCurrentUser(state),
    paperShow: getMemoizedPaperShow(state),
    paper: getMemoizedPaper(state),
    PDFViewerState: getMemoizedPDFViewerState(state),
    referencePapers: getReferencePapers(state),
    citedPapers: getCitedPapers(state),
  };
}

export interface PaperShowProps extends RouteComponentProps<PaperShowMatchParams> {
  layout: LayoutState;
  configuration: Configuration;
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  PDFViewerState: PDFViewerState;
  dispatch: Dispatch<any>;
  paper: Paper | null;
  referencePapers: Paper[];
  citedPapers: Paper[];
}

interface PaperShowStates
  extends Readonly<{
      isAboveRef: boolean;
      isOnRef: boolean;
      isOnCited: boolean;
      isOnFullText: boolean;
      isSearchFullBannerOpen: boolean;
      hadQuitSearchFullBanner: boolean;
    }> {}

const Title: React.FC<{ title: string }> = React.memo(({ title }) => {
  return <h1 className={styles.paperTitle} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(title) }} />;
});

const Abstract: React.FC<{ abstract: string }> = React.memo(({ abstract }) => {
  return <div className={styles.abstractContent} dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(abstract) }} />;
});

@withStyles<typeof PaperShow>(styles)
class PaperShow extends React.PureComponent<PaperShowProps, PaperShowStates> {
  private cancelToken = axios.CancelToken.source();
  private fullTextTabWrapper: HTMLDivElement | null;
  private refTabWrapper: HTMLDivElement | null;
  private citedTabWrapper: HTMLDivElement | null;

  public constructor(props: PaperShowProps) {
    super(props);

    this.state = {
      isAboveRef: true,
      isOnRef: false,
      isOnCited: false,
      isOnFullText: false,
      isSearchFullBannerOpen: false,
      hadQuitSearchFullBanner: false,
    };
  }

  public async componentDidMount() {
    const { currentUser, dispatch, match, location, paperShow, configuration } = this.props;
    const queryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);
    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.succeedAPIFetchAtServer || configuration.renderedAtClient;

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.handleScrollEvent();

    dispatch(getRelatedPapers(parseInt(this.props.match.params.paperId, 10), this.cancelToken));

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      const err = await fetchPaperShowData(
        {
          dispatch,
          match,
          pathname: location.pathname,
          queryParams,
          cancelToken: this.cancelToken.token,
        },
        currentUser
      );
      const statusCode = err ? (err as CommonError).status : null;
      this.logPageView(match.params.paperId, statusCode);
      this.scrollToRefCitedSection();
    } else {
      this.logPageView(match.params.paperId, paperShow.errorStatusCode);
    }
  }

  public async componentDidUpdate(prevProps: PaperShowProps) {
    const { dispatch, match, location, currentUser } = prevProps;
    const prevQueryParams: PaperShowPageQueryParams = getQueryParamsObject(location.search);
    const nextQueryParams: PaperShowPageQueryParams = getQueryParamsObject(this.props.location.search);

    const moveToDifferentPage = match.params.paperId !== this.props.match.params.paperId;
    const changeRefPage = prevQueryParams['ref-page'] !== nextQueryParams['ref-page'];
    const changeCitedPage = prevQueryParams['cited-page'] !== nextQueryParams['cited-page'];

    if (moveToDifferentPage) {
      dispatch(clearPaperShowState());
      dispatch(getRelatedPapers(parseInt(this.props.match.params.paperId, 10), this.cancelToken));
      const err = await fetchPaperShowData(
        {
          dispatch,
          match: this.props.match,
          pathname: this.props.location.pathname,
          queryParams: nextQueryParams,
          cancelToken: this.cancelToken.token,
        },
        currentUser
      );
      const statusCode = err ? (err as CommonError).status : null;
      this.logPageView(match.params.paperId, statusCode);
      this.scrollToRefCitedSection();
      this.setState({ hadQuitSearchFullBanner: false });
      return this.handleScrollEvent();
    }

    if (
      currentUser.isLoggedIn !== this.props.currentUser.isLoggedIn &&
      this.props.currentUser.isLoggedIn &&
      this.props.paper
    ) {
      return dispatch(fetchMyCollection(this.props.paper.id, this.cancelToken.token));
    }

    if (this.props.paper && changeRefPage) {
      await dispatch(fetchRefPaperData(this.props.paper.id, nextQueryParams['ref-page'], this.cancelToken.token));
      if (this.refTabWrapper) {
        this.refTabWrapper.scrollIntoView();
      }
    } else if (this.props.paper && changeCitedPage) {
      await dispatch(fetchCitedPaperData(this.props.paper.id, nextQueryParams['cited-page'], this.cancelToken.token));
      if (this.citedTabWrapper) {
        this.citedTabWrapper.scrollIntoView();
      }
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;

    this.cancelToken.cancel();
    dispatch(clearPaperShowState());
    window.removeEventListener('scroll', this.handleScroll);
  }

  public render() {
    const {
      layout,
      paperShow,
      location,
      currentUser,
      paper,
      referencePapers,
      citedPapers,
      PDFViewerState,
    } = this.props;
    const { isOnFullText, isOnCited, isOnRef, isSearchFullBannerOpen } = this.state;

    if (paperShow.isLoadingPaper) {
      return (
        <div className={styles.paperShowWrapper}>
          <ArticleSpinner style={{ margin: '200px auto' }} />
        </div>
      );
    }

    if (paperShow.errorStatusCode) {
      return <ErrorPage errorNum={paperShow.errorStatusCode} />;
    }

    if (!paper) {
      return null;
    }

    return (
      <>
        <div className={styles.container}>
          <PaperShowHelmet paper={paper} />
          <article className={styles.paperShow}>
            <div className={styles.paperShowContent}>
              <GoBackResultBtn />
              <Title title={paper.title} />
              <VenueAndAuthors
                pageType={'paperShow'}
                actionArea={'paperDescription'}
                paper={paper}
                journal={paper.journal}
                conferenceInstance={paper.conferenceInstance}
                publishedDate={paper.publishedDate}
                authors={paper.authors}
              />
              <div className={styles.paperContentBlockDivider} />
              <div className={styles.actionBarWrapper}>
                <NoSsr>
                  <ActionBar
                    paper={paper}
                    isLoadingPDF={PDFViewerState.isLoading}
                    currentUser={currentUser}
                    hasPDFFullText={!!PDFViewerState.parsedPDFObject}
                    handleClickFullText={this.scrollToSection('fullText')}
                  />
                </NoSsr>
              </div>
              <div className={styles.paperContentBlockDivider} />
              <div className={styles.paperContent}>
                <div className={styles.abstract}>
                  <div className={styles.paperContentBlockHeader}>Abstract</div>
                </div>
                <Abstract abstract={paperShow.highlightAbstract || paper.abstract} />
                <div className={styles.fos}>
                  <FOSList FOSList={paper.fosList} />
                </div>
              </div>
            </div>
          </article>
          <div>
            <RelatedPapers
              shouldShowRelatedPapers={
                !PDFViewerState.isLoading &&
                PDFViewerState.hasFailed &&
                getUserGroupName(RELATED_PAPERS_AT_PAPER_SHOW_TEST) !== 'control'
              }
            />
            <div className={styles.refCitedTabWrapper} ref={el => (this.fullTextTabWrapper = el)}>
              <PaperShowRefCitedTab
                paper={paper}
                currentUser={currentUser}
                afterDownloadPDF={this.scrollToSection('fullText')}
                onClickDownloadPDF={this.handleClickDownloadPDF}
                onClickTabItem={this.handleClickRefCitedTabItem}
                isFixed={isOnFullText || isOnRef || isOnCited}
                isOnRef={isOnRef}
                isOnCited={isOnCited}
                isOnFullText={isOnFullText}
                isLoading={PDFViewerState.isLoading}
                canShowFullPDF={!!PDFViewerState.parsedPDFObject}
              />
            </div>
            <NoSsr>
              {layout.userDevice === UserDevice.DESKTOP && (
                <PDFViewer
                  paper={paper}
                  shouldShowRelatedPapers={
                    (!paper.bestPdf || !paper.bestPdf.hasBest) &&
                    getUserGroupName(RELATED_PAPERS_AT_PAPER_SHOW_TEST) !== 'control'
                  }
                  afterDownloadPDF={this.scrollToSection('fullText')}
                />
              )}
            </NoSsr>
          </div>
          <div className={styles.refCitedTabWrapper} ref={el => (this.refTabWrapper = el)} />
          <div className={styles.citedBy}>
            <article className={styles.paperShow}>
              <div>
                <span className={styles.sectionTitle}>References</span>
                <span className={styles.sectionCount}>{paper.referenceCount}</span>
              </div>
              <div className={styles.otherPapers}>
                <div className={styles.references}>
                  <ReferencePapers
                    type="reference"
                    isMobile={layout.userDevice !== UserDevice.DESKTOP}
                    papers={referencePapers}
                    currentUser={currentUser}
                    paperShow={paperShow}
                    getLinkDestination={this.getReferencePaperPaginationLink}
                    location={location}
                  />
                </div>
              </div>
            </article>
          </div>
          <div className={styles.sectionDivider} />
          <div className={styles.refCitedTabWrapper} ref={el => (this.citedTabWrapper = el)} />
          <div className={styles.citedBy}>
            <article className={styles.paperShow}>
              <div>
                <span className={styles.sectionTitle}>Cited By</span>
                <span className={styles.sectionCount}>{paper.citedCount}</span>
              </div>
              <div className={styles.otherPapers}>
                <ReferencePapers
                  type="cited"
                  isMobile={layout.userDevice !== UserDevice.DESKTOP}
                  papers={citedPapers}
                  currentUser={currentUser}
                  paperShow={paperShow}
                  getLinkDestination={this.getCitedPaperPaginationLink}
                  location={location}
                />
              </div>
            </article>
          </div>
        </div>
        <div className={styles.footerWrapper}>
          <Footer />
        </div>
        <BottomBanner currentUser={currentUser} />
        <NextPaperTab />
        <SearchFullScrollBanner
          onClickCloseBtn={() => {
            this.setState(prevState => ({
              ...prevState,
              isSearchFullBannerOpen: false,
              hadQuitSearchFullBanner: true,
            }));
          }}
          isOpen={isSearchFullBannerOpen}
        />
      </>
    );
  }

  private logPageView = (paperId: string | number, errorStatus?: number | null) => {
    if (!EnvChecker.isOnServer()) {
      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'view',
        actionArea: errorStatus ? String(errorStatus) : null,
        actionTag: 'pageView',
        actionLabel: String(paperId),
      });
    }
  };

  private scrollToRefCitedSection = () => {
    const { paperShow, location } = this.props;

    if (paperShow.citedPaperCurrentPage === 1 && location.hash === '#cited') {
      this.scrollToSection('cited');
    } else if (paperShow.referencePaperCurrentPage === 1 && location.hash === '#references') {
      this.scrollToSection('ref');
    } else {
      restoreScroll(location.key);
    }
  };

  private handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(this.handleScrollEvent);
    }
    ticking = true;
  };

  private handleClickDownloadPDF = () => {
    const { dispatch } = this.props;
    dispatch(ActionCreators.clickPDFDownloadBtn());
  };

  private handleScrollEvent = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (this.refTabWrapper) {
      const scrollPositionOverRefTab = scrollTop + window.innerHeight - this.refTabWrapper.offsetTop;
      if (
        this.props.layout.userDevice === UserDevice.DESKTOP &&
        !this.state.isSearchFullBannerOpen &&
        !this.state.hadQuitSearchFullBanner &&
        this.props.configuration.initialPageType === 'paperShow' &&
        getUserGroupName(SIGN_BANNER_AT_PAPER_SHOW_TEST) === 'searchBanner' &&
        scrollPositionOverRefTab > 400
      ) {
        this.setState(prevState => ({ ...prevState, isSearchFullBannerOpen: true }));
      } else if (this.state.isSearchFullBannerOpen && scrollPositionOverRefTab <= 400) {
        this.setState(prevState => ({ ...prevState, isSearchFullBannerOpen: false }));
      }
    }

    // ref/cited tab
    if (this.fullTextTabWrapper && this.refTabWrapper && this.citedTabWrapper) {
      const fullTextOffsetTop = this.fullTextTabWrapper.offsetTop;
      const refOffsetTop = this.refTabWrapper.offsetTop;
      const citedOffsetTop = this.citedTabWrapper.offsetTop;
      const currentScrollTop = scrollTop + NAVBAR_HEIGHT;

      if (citedOffsetTop === 0 && refOffsetTop === 0 && fullTextOffsetTop === 0) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: false,
          isOnCited: false,
          isAboveRef: false,
        }));
      } else if (fullTextOffsetTop > currentScrollTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: false,
          isOnCited: false,
          isAboveRef: true,
        }));
      } else if (currentScrollTop >= fullTextOffsetTop && currentScrollTop < refOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: true,
          isOnRef: false,
          isOnCited: false,
          isAboveRef: true,
        }));
      } else if (currentScrollTop >= refOffsetTop && currentScrollTop < citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: true,
          isOnCited: false,
          isAboveRef: false,
        }));
      } else if (currentScrollTop >= citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isOnFullText: false,
          isOnRef: false,
          isOnCited: true,
          isAboveRef: false,
        }));
      }
    } else if (this.refTabWrapper && this.citedTabWrapper) {
      const refOffsetBottom = this.refTabWrapper.offsetTop;
      const citedOffsetTop = this.citedTabWrapper.offsetTop;
      const currentScrollTop = scrollTop + NAVBAR_HEIGHT;

      if (!this.state.isAboveRef && currentScrollTop < refOffsetBottom) {
        this.setState(prevState => ({ ...prevState, isAboveRef: true, isOnCited: false, isOnRef: false }));
      } else if (!this.state.isOnRef && currentScrollTop >= refOffsetBottom && currentScrollTop < citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isAboveRef: false,
          isOnCited: false,
          isOnRef: true,
        }));
      } else if (!this.state.isOnCited && currentScrollTop >= citedOffsetTop) {
        this.setState(prevState => ({
          ...prevState,
          isAboveRef: false,
          isOnCited: true,
          isOnRef: false,
        }));
      }
    }

    ticking = false;
  };

  private getCitedPaperPaginationLink = (page: number) => {
    const { paper, location } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...{ 'cited-page': page },
    };
    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    return {
      to: `/papers/${paper ? paper.id : 0}`,
      search: stringifiedQueryParams,
    };
  };

  private getReferencePaperPaginationLink = (page: number) => {
    const { paper, location } = this.props;
    const queryParamsObject: PaperShowPageQueryParams = getQueryParamsObject(location.search);

    const updatedQueryParamsObject: PaperShowPageQueryParams = {
      ...queryParamsObject,
      ...{ 'ref-page': page },
    };
    const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
      addQueryPrefix: true,
    });

    return {
      to: `/papers/${paper ? paper.id : 0}`,
      search: stringifiedQueryParams,
    };
  };

  private handleClickRefCitedTabItem = (section: RefCitedTabItem) => () => {
    const { paper } = this.props;
    let actionTag: Scinapse.ActionTicket.ActionTagType;
    if (section === 'fullText') {
      actionTag = 'downloadPdf';
    } else if (section === 'ref') {
      actionTag = 'refList';
    } else {
      actionTag = 'citedList';
    }

    this.scrollToSection(section)();
    ActionTicketManager.trackTicket({
      pageType: 'paperShow',
      actionType: 'fire',
      actionArea: 'contentNavbar',
      actionTag,
      actionLabel: String(paper!.id),
    });
  };

  private scrollToSection = (section: RefCitedTabItem) => () => {
    let target: HTMLDivElement | null = null;

    switch (section) {
      case 'fullText': {
        target = this.fullTextTabWrapper;
        break;
      }

      case 'ref': {
        target = this.refTabWrapper;
        break;
      }

      case 'cited': {
        target = this.citedTabWrapper;
        break;
      }
    }

    if (!EnvChecker.isOnServer() && target) {
      window.scrollTo(0, target.offsetTop - NAVBAR_HEIGHT);
    }
  };
}

export default connect(mapStateToProps)(withRouter(PaperShow));
