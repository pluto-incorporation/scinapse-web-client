import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Cookies from 'js-cookie';
import { denormalize } from 'normalizr';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as addDays from 'date-fns/add_days';
import * as isAfter from 'date-fns/is_after';
import * as classNames from 'classnames';
import TopToastBar from '../topToastBar';
import BubblePopover from '../common/bubblePopover';
import { AppState } from '../../reducers';
import Icon from '../../icons';
import { signOut } from '../auth/actions';
import { trackDialogView } from '../../helpers/handleGA';
import { HeaderProps } from './types/header';
import { withStyles } from '../../helpers/withStylesHelper';
import EnvChecker from '../../helpers/envChecker';
import { UserDevice } from './records';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
import SearchQueryInput from '../common/InputWithSuggestionList/searchQueryInput';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import SafeURIStringHandler from '../../helpers/safeURIStringHandler';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { HOME_PATH } from '../../constants/routes';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { CurrentUser } from '../../model/currentUser';
import { FilterObject, DEFAULT_FILTER } from '../../helpers/searchQueryManager';
import { getCollections } from '../collections/actions';
import { collectionSchema } from '../../model/collection';
import { getMemoizedPaper } from '../../containers/paperShow/select';
import ResearchHistory from '../researchHistory';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { SEARCH_ENGINE_MOOD_TEST } from '../../constants/abTestGlobalValue';
const styles = require('./improvedHeader.scss');

const HEADER_BACKGROUND_START_HEIGHT = 10;
const LAST_UPDATE_DATE = '2019-01-30T08:13:33.079Z';
const MAX_KEYWORD_SUGGESTION_LIST_COUNT = 10;
let ticking = false;

function mapStateToProps(state: AppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    articleSearchState: state.articleSearch,
    authorSearchState: state.authorSearch,
    myCollectionsState: state.myCollections,
    userCollections: denormalize(state.myCollections.collectionIds, [collectionSchema], state.entities),
    paper: getMemoizedPaper(state),
  };
}

interface HeaderStates {
  isTop: boolean;
  isUserDropdownOpen: boolean;
  userDropdownAnchorElement: HTMLElement | null;
  openTopToast: boolean;
  searchKeyword: string;
  isSearchEngineMood: boolean;
}

const UserInformation: React.FunctionComponent<{ user: CurrentUser }> = props => {
  const { user } = props;

  return (
    <div className={styles.userInfoWrapper}>
      <div className={styles.username}>{`${user.firstName} ${user.lastName || ''}`}</div>
      <div className={styles.email}>{user.email}</div>
    </div>
  );
};

@withStyles<typeof ImprovedHeader>(styles)
class ImprovedHeader extends React.PureComponent<HeaderProps, HeaderStates> {
  private cancelToken = axios.CancelToken.source();
  private userDropdownAnchorRef: HTMLElement | null;

  public constructor(props: HeaderProps) {
    super(props);

    const rawQueryParamsObj: Scinapse.ArticleSearch.RawQueryParams = getQueryParamsObject(props.location.search);
    this.state = {
      isTop: true,
      isUserDropdownOpen: false,
      userDropdownAnchorElement: this.userDropdownAnchorRef,
      openTopToast: false,
      searchKeyword: SafeURIStringHandler.decode(rawQueryParamsObj.query || ''),
      isSearchEngineMood: false,
    };
  }

  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      window.addEventListener('scroll', this.handleScrollEvent, { passive: true });
      this.checkTopToast();
    }

    this.setState({
      isSearchEngineMood: getUserGroupName(SEARCH_ENGINE_MOOD_TEST) === 'searchEngine',
    });
  }

  public componentWillUnmount() {
    if (!EnvChecker.isOnServer()) {
      window.removeEventListener('scroll', this.handleScrollEvent);
    }
  }

  public componentDidUpdate(prevProps: HeaderProps) {
    if (
      prevProps.currentUserState.isLoggedIn !== this.props.currentUserState.isLoggedIn &&
      this.props.currentUserState.isLoggedIn
    ) {
      const currentUser = this.props.currentUserState;
      this.cancelToken.cancel();
      this.cancelToken = axios.CancelToken.source();
      this.props.dispatch(getCollections(currentUser.id, this.cancelToken.token, true));
    }
  }

  public render() {
    const navClassName = this.getNavbarClassName();

    console.log('rendering improved navbar');

    return (
      <nav className={`${navClassName} mui-fixed`}>
        <div className={styles.headerContainer}>
          <div className={styles.leftBox}>
            {this.getHeaderLogo()}
            {this.getSearchFormContainer(this.state.isSearchEngineMood)}
          </div>
          {this.getHeaderButtons()}
        </div>
        {this.getToastBar()}
      </nav>
    );
  }

  private checkTopToast = () => {
    const old = new Date(LAST_UPDATE_DATE);
    const comparisonDate = addDays(old, 5);
    const now = new Date();
    const updateIsStaled = isAfter(now, comparisonDate);
    const alreadyOpenedTopToast = !!Cookies.get('alreadyOpenedTopToast');
    const shouldOpenToast = !updateIsStaled && !alreadyOpenedTopToast;

    if (shouldOpenToast) {
      this.setState(prevState => ({
        ...prevState,
        openTopToast: true,
      }));
    }
  };

  private getToastBar = () => {
    const { openTopToast } = this.state;

    if (openTopToast) {
      return <TopToastBar onClose={this.handleCloseTopToast} />;
    }
    return null;
  };

  private handleCloseTopToast = () => {
    Cookies.set('alreadyOpenedTopToast', '1', { expires: 3 });
    this.setState(prevState => ({ ...prevState, openTopToast: false }));
  };

  private getNavbarClassName = () => {
    const { location } = this.props;

    if (location.pathname !== HOME_PATH) {
      if (this.state.isTop) {
        return styles.navbar;
      } else {
        return `${styles.navbar} ${styles.scrolledNavbar}`;
      }
    } else {
      if (this.state.isTop) {
        return `${styles.navbar} ${styles.searchHomeNavbar}`;
      } else {
        return `${styles.navbar} ${styles.scrolledNavbar} ${styles.searchHomeNavbar}`;
      }
    }
  };

  private handleScrollEvent = () => {
    if (!ticking) {
      requestAnimationFrame(this.updateIsTopState);
    }

    ticking = true;
  };

  private updateIsTopState = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (scrollTop < HEADER_BACKGROUND_START_HEIGHT) {
      this.setState({
        isTop: true,
      });
    } else {
      this.setState({
        isTop: false,
      });
    }

    ticking = false;
  };

  private getHeaderLogo = () => {
    const { location, layoutState } = this.props;
    const isNotHome = location.pathname !== HOME_PATH;

    if (layoutState.userDevice !== UserDevice.DESKTOP && isNotHome) {
      return (
        <Link to="/" className={styles.headerLogoMark} aria-label="Scinapse small header logo">
          <Icon icon="SCINAPSE_LOGO_SMALL" />
        </Link>
      );
    }

    return (
      <Link
        to="/"
        onClick={() =>
          ActionTicketManager.trackTicket({
            pageType: getCurrentPageType(),
            actionType: 'fire',
            actionArea: 'topBar',
            actionTag: 'clickLogo',
            actionLabel: null,
          })
        }
        className={styles.headerLogo}
        aria-label="Scinapse header logo"
      >
        <Icon icon="SCINAPSE_IMPROVEMENT_LOGO" />{' '}
      </Link>
    );
  };

  private getSearchFormContainer = (isSearchEngineMood: boolean) => {
    const { location, articleSearchState } = this.props;
    const shouldShowSearchFormContainer = location.pathname !== HOME_PATH;
    const currentFilter: FilterObject = articleSearchState.selectedFilter
      ? articleSearchState.selectedFilter.filter
      : DEFAULT_FILTER;

    if (!shouldShowSearchFormContainer) return null;

    return (
      <div
        className={classNames({
          [styles.searchFormContainerAtSearchEngineLogo]: isSearchEngineMood,
          [styles.searchFormContainer]: !isSearchEngineMood,
        })}
      >
        <SearchQueryInput
          wrapperClassName={styles.searchWrapper}
          listWrapperClassName={styles.suggestionListWrapper}
          inputClassName={isSearchEngineMood ? styles.searchEngineMoodInput : styles.searchInput}
          // initialValue={searchKeyword}
          initialFilter={currentFilter}
          actionArea="topBar"
          maxCount={MAX_KEYWORD_SUGGESTION_LIST_COUNT}
        />
      </div>
    );
  };

  private handleClickSignOut = async () => {
    const { dispatch } = this.props;

    try {
      await dispatch(signOut());
      this.handleRequestCloseUserDropdown();
    } catch (_err) {
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: `Failed to sign out.`,
        },
      });
    }
  };

  private handleOpenSignIn = () => {
    GlobalDialogManager.openSignInDialog({
      authContext: {
        pageType: getCurrentPageType(),
        actionArea: 'topBar',
        actionLabel: null,
      },
      isBlocked: false,
    });
  };

  private handleOpenSignUp = () => {
    GlobalDialogManager.openSignUpDialog({
      authContext: {
        pageType: getCurrentPageType(),
        actionArea: 'topBar',
        actionLabel: null,
      },
      isBlocked: false,
    });
  };

  private handleToggleUserDropdown = () => {
    this.setState({
      userDropdownAnchorElement: this.userDropdownAnchorRef,
      isUserDropdownOpen: !this.state.isUserDropdownOpen,
    });
  };

  private handleRequestCloseUserDropdown = () => {
    if (this.state.isUserDropdownOpen) {
      this.setState({
        isUserDropdownOpen: false,
      });
    }
  };

  private userDropdownMenuItems = () => {
    const { currentUserState, myCollectionsState } = this.props;

    return (
      <div className={styles.menuItems}>
        <MenuItem classes={{ root: styles.userInfoMenuItem }} disabled disableGutters>
          <UserInformation user={currentUserState} />
        </MenuItem>
        {currentUserState.isAuthorConnected ? (
          <MenuItem classes={{ root: styles.profileButton }}>
            <Link
              className={styles.buttonOnLink}
              onClick={this.handleRequestCloseUserDropdown}
              to={`/authors/${currentUserState.authorId}?beta=true`}
            >
              Profile
            </Link>
          </MenuItem>
        ) : null}
        <MenuItem classes={{ root: styles.collectionButton }}>
          <Link
            className={styles.buttonOnLink}
            onClick={this.handleRequestCloseUserDropdown}
            to={
              !!myCollectionsState && myCollectionsState.collectionIds.length > 0
                ? `/collections/${myCollectionsState.collectionIds[0]}`
                : `/users/${currentUserState.id}/collections`
            }
          >
            Collection
          </Link>
        </MenuItem>
        <MenuItem classes={{ root: styles.signOutButton }} onClick={this.handleClickSignOut}>
          <span className={styles.buttonText}>Sign Out</span>
        </MenuItem>
      </div>
    );
  };

  private getUserDropdown = () => {
    const { currentUserState, myCollectionsState, paper } = this.props;

    const firstCharacterOfUsername = currentUserState.firstName.slice(0, 1).toUpperCase();

    return (
      <div className={styles.rightBox}>
        <div className={styles.historyBtnWrapper}>
          <ResearchHistory paper={paper} isLoggedIn={currentUserState.isLoggedIn} />
        </div>
        <Link
          className={styles.externalCollectionButton}
          onClick={() => {
            this.handleRequestCloseUserDropdown();
            ActionTicketManager.trackTicket({
              pageType: getCurrentPageType(),
              actionType: 'fire',
              actionArea: 'topBar',
              actionTag: 'collectionShow',
              actionLabel: String(myCollectionsState.collectionIds[0]),
            });
          }}
          to={
            !!myCollectionsState && myCollectionsState.collectionIds.length > 0
              ? `/collections/${myCollectionsState.collectionIds[0]}`
              : `/users/${currentUserState.id}/collections`
          }
        >
          <Icon className={styles.collectionIcon} icon="COLLECTION" />Collection
        </Link>
        <div>
          {!currentUserState.profileImageUrl ? (
            <div
              className={styles.userDropdownChar}
              ref={el => (this.userDropdownAnchorRef = el)}
              onClick={this.handleToggleUserDropdown}
            >
              {firstCharacterOfUsername}
            </div>
          ) : (
            <div
              className={styles.userDropdownImg}
              ref={el => (this.userDropdownAnchorRef = el)}
              onClick={this.handleToggleUserDropdown}
            >
              <div
                style={{ backgroundImage: `url(${currentUserState.profileImageUrl})` }}
                className={styles.profileImage}
              />
            </div>
          )}
          <BubblePopover
            open={this.state.isUserDropdownOpen}
            anchorEl={this.state.userDropdownAnchorElement}
            placement="bottom-end"
            popperOptions={{ positionFixed: true }}
          >
            <ClickAwayListener onClickAway={this.handleRequestCloseUserDropdown}>
              {this.userDropdownMenuItems()}
            </ClickAwayListener>
          </BubblePopover>
        </div>
      </div>
    );
  };

  private getHeaderButtons = () => {
    const { currentUserState } = this.props;
    const { isLoggedIn } = currentUserState;

    if (!isLoggedIn) {
      return (
        <div className={styles.rightBox}>
          <div
            onClick={() => {
              this.handleOpenSignIn();
              trackDialogView('headerSignInOpen');
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'topBar',
                actionTag: 'signInPopup',
                actionLabel: 'topBar',
              });
            }}
            className={styles.signInButton}
          >
            Sign in
          </div>
          <div
            onClick={() => {
              this.handleOpenSignUp();
              trackDialogView('headerSignUpOpen');
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'topBar',
                actionTag: 'signUpPopup',
                actionLabel: 'topBar',
              });
            }}
            className={styles.signUpButton}
          >
            Sign up
          </div>
        </div>
      );
    } else {
      return this.getUserDropdown();
    }
  };
}

export default hot(withRouter(connect(mapStateToProps)(ImprovedHeader)));
