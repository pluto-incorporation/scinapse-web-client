import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import { AppState } from '../../reducers';
import { Footer } from '../layouts';
import { LayoutState, UserDevice } from '../layouts/records';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryInput from '../common/InputWithSuggestionList/searchQueryInput';
import TrendingPaper from './components/trendingPaper';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { SEARCH_ENGINE_MOOD_TEST } from '../../constants/abTestGlobalValue';
import Icon from '../../icons';
const styles = require('./home.scss');

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

function getContainerStyle(layout: LayoutState): React.CSSProperties {
  if (layout.userDevice !== UserDevice.DESKTOP) {
    return { position: 'absolute', margin: '0 0 9px 0', width: '100%' };
  } else {
    return {};
  }
}

const Home: React.FC<Props> = props => {
  const [isSearchEngineMood, setIsSearchEngineMood] = React.useState(false);

  React.useEffect(() => {
    setIsSearchEngineMood(getUserGroupName(SEARCH_ENGINE_MOOD_TEST) === 'searchEngine');
  }, []);

  const containerStyle = getContainerStyle(props.layout);
  return (
    <div className={styles.articleSearchFormContainer}>
      {getHelmetNode()}
      <h1 style={{ display: 'none' }}>Scinapse | Academic search engine for paper</h1>
      <div className={styles.searchFormInnerContainer}>
        <div className={styles.searchFormContainer}>
          <div className={styles.formWrapper}>
            <div className={styles.searchTitle}>
              <Icon icon="SCINAPSE_HOME_LOGO" className={styles.scinapseHomeLogo} />
            </div>
            <div className={styles.searchSubTitle}>Academic Search Engine</div>
            <div tabIndex={0} className={styles.searchInputForm}>
              <SearchQueryInput
                maxCount={MAX_KEYWORD_SUGGESTION_LIST_COUNT}
                actionArea="home"
                autoFocus
                inputClassName={isSearchEngineMood ? styles.searchEngineMoodInput : styles.searchInput}
              />
            </div>
            <div className={styles.searchTryKeyword} />
            <div className={styles.searchSubTitle}>We’re better than Google Scholar. We mean it.</div>
          </div>
        </div>
        <div className={styles.contentBlockDivider} />

        <TrendingPaper />
        <Footer containerStyle={containerStyle} />
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof Home>(styles)(Home)));
