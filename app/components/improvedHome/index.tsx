import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Dispatch } from 'redux';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import ReactCountUp from 'react-countup';
import { AppState } from '../../reducers';
import { LayoutState, UserDevice } from '../layouts/records';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryInput from '../common/InputWithSuggestionList/searchQueryInput';
import TrendingPaper from '../home/components/trendingPaper';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { SEARCH_ENGINE_MOOD_TEST, KNOWLEDGE_BASED_RECOMMEND_TEST } from '../../constants/abTestGlobalValue';
import Icon from '../../icons';
import JournalsInfo from './components/journalsInfo';
import AffiliationsInfo from './components/affiliationsInfo';
import homeAPI, { BasedOnCollectionPapersParams } from '../../api/home';
import ImprovedFooter from '../layouts/improvedFooter';
import RecommendedPapers from './components/recommendedPapers';
import { Paper } from '../../model/paper';
const styles = require('./improvedHome.scss');

const MAX_KEYWORD_SUGGESTION_LIST_COUNT = 5;

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps<any> & {
    layout: LayoutState;
    dispatch: Dispatch<any>;
  };

function getHelmetNode() {
  const structuredDataJSON = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    url: 'https://scinapse.io',
    logo: 'https://s3.amazonaws.com/pluto-asset/scinapse/scinapse-logo.png',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'team@pluto.network',
        url: 'https://pluto.network',
        contactType: 'customer service',
      },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://scinapse.io/search?query={search_term_string}&utm_source=google_search_result',
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://www.facebook.com/PlutoNetwork',
      'https://twitter.com/pluto_network',
      'https://medium.com/pluto-network',
      'https://pluto.network',
    ],
  };

  return (
    <Helmet script={[{ type: 'application/ld+json', innerHTML: JSON.stringify(structuredDataJSON) }]}>
      <link rel="canonical" href="https://scinapse.io" />
    </Helmet>
  );
}

const ScinapseInformation: React.FC<{ isMobile: boolean; shouldShow: boolean }> = ({ isMobile, shouldShow }) => {
  if (!shouldShow) return null;

  return (
    <div>
      <JournalsInfo isMobile={isMobile} />
      <AffiliationsInfo />
      <div className={styles.contentBlockDivider} />
      <div className={styles.trendingPaperWrapper}>
        <TrendingPaper />
      </div>
    </div>
  );
};

const ScinapseFigureContent: React.FC<{ shouldShow: boolean; papersFoundCount: number }> = ({
  shouldShow,
  papersFoundCount,
}) => {
  if (!shouldShow) return null;

  return (
    <>
      <div className={styles.cumulativeCountContainer}>
        <span>
          <b>50,000+</b> registered researchers have found
        </span>
        <br />
        <span>
          <b>
            <ReactCountUp
              start={papersFoundCount > 10000 ? papersFoundCount - 10000 : papersFoundCount}
              end={papersFoundCount}
              separator=","
              duration={3}
            />
            {`+`}
          </b>
          {` papers using Scinapse`}
        </span>
      </div>
      <Icon icon="ARROW_POINT_TO_DOWN" className={styles.downIcon} />
    </>
  );
};

const ImprovedHome: React.FC<Props> = props => {
  const { currentUser } = props;
  const [isKnowledgeBasedRecommended, setIsKnowledgeBasedRecommended] = React.useState(false);
  const [papersFoundCount, setPapersFoundCount] = React.useState(0);
  const [basedOnActivityPapers, setBasedOnActivityPapers] = React.useState<Paper[]>([]);
  const [basedOnCollectionPapers, setBasedOnCollectionPapers] = React.useState<BasedOnCollectionPapersParams>();
  const [isLoadingBasedOnActivityPapers, setIsLoadingBasedOnActivityPapers] = React.useState(false);
  const [isLoadingBasedOnCollectionPapers, setIsLoadingBasedOnCollectionPapers] = React.useState(false);
  const cancelToken = React.useRef(axios.CancelToken.source());

  React.useEffect(() => {
    setIsKnowledgeBasedRecommended(getUserGroupName(KNOWLEDGE_BASED_RECOMMEND_TEST) === 'knowledgeBasedRecommend');

    homeAPI.getPapersFoundCount().then(res => {
      setPapersFoundCount(res.data.content);
    });

    return () => {
      cancelToken.current.cancel();
      cancelToken.current = axios.CancelToken.source();
    };
  }, []);

  React.useEffect(
    () => {
      if (currentUser.isLoggedIn) {
        setIsLoadingBasedOnActivityPapers(true);
        setIsLoadingBasedOnCollectionPapers(true);

        homeAPI
          .getBasedOnActivityPapers()
          .then(res => {
            setBasedOnActivityPapers(res);
            setIsLoadingBasedOnActivityPapers(false);
          })
          .catch(err => {
            console.error(err);
            setIsLoadingBasedOnActivityPapers(false);
          });

        homeAPI
          .getBasedOnCollectionPapers()
          .then(res => {
            setBasedOnCollectionPapers(res);
            setIsLoadingBasedOnCollectionPapers(false);
          })
          .catch(err => {
            console.error(err);
            setIsLoadingBasedOnCollectionPapers(false);
          });
      }

      return () => {
        setIsLoadingBasedOnActivityPapers(false);
        setIsLoadingBasedOnCollectionPapers(false);
        cancelToken.current.cancel();
        cancelToken.current = axios.CancelToken.source();
      };
    },
    [currentUser.isLoggedIn]
  );

  const shouldShow =
    isKnowledgeBasedRecommended &&
    currentUser.isLoggedIn &&
    basedOnActivityPapers &&
    basedOnActivityPapers.length > 0 &&
    props.layout.userDevice === UserDevice.DESKTOP;

  return (
    <div className={styles.articleSearchFormContainer}>
      {getHelmetNode()}
      <h1 style={{ display: 'none' }}>Scinapse | Academic search engine for paper</h1>
      <div className={styles.searchFormInnerContainer}>
        <div
          className={classNames({
            [styles.searchFormContainer]: true,
            [styles.knowledge]: shouldShow,
          })}
        >
          <div className={styles.formWrapper}>
            <div className={styles.title}>
              <Icon icon="SCINAPSE_HOME_LOGO" className={styles.scinapseHomeLogo} />
            </div>
            <div className={styles.subTitle}>Academic Search Engine</div>
            <div tabIndex={0} className={styles.searchInputForm}>
              <SearchQueryInput
                maxCount={MAX_KEYWORD_SUGGESTION_LIST_COUNT}
                actionArea="home"
                autoFocus
                inputClassName={styles.searchInput}
              />
            </div>
            <div className={styles.searchTryKeyword} />
            <div className={styles.catchphrase}>We’re better than Google Scholar. We mean it.</div>
            <ScinapseFigureContent shouldShow={!shouldShow} papersFoundCount={papersFoundCount} />
          </div>
          {shouldShow && <div className={styles.recommendedPapersBlockDivider} />}
        </div>
        <RecommendedPapers
          shouldShow={shouldShow}
          isLoggingIn={currentUser.isLoggingIn}
          isLoadingActivityPapers={isLoadingBasedOnActivityPapers}
          isLoadingCollectionPapers={isLoadingBasedOnCollectionPapers}
          basedOnActivityPapers={basedOnActivityPapers}
          basedOnCollectionPapers={basedOnCollectionPapers}
        />
        <ScinapseInformation isMobile={props.layout.userDevice === UserDevice.MOBILE} shouldShow={!shouldShow} />
        <ImprovedFooter />
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
  };
}

export default hot(withRouter(connect(mapStateToProps)(withStyles<typeof ImprovedHome>(styles)(ImprovedHome))));
