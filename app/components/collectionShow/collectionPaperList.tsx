import React from 'react';
import { PaperInCollection } from '../../model/paperInCollection';
import { CurrentUser } from '../../model/currentUser';
import { CollectionShowState } from '../../containers/collectionShow/reducer';
import { Collection } from '../../model/collection';
import PaperItem from '../common/paperItem/paperItem';
import PaperItemButtonGroup from '../common/paperItem/paperItemButtonGroup';
import ArticleSpinner from '../common/spinner/articleSpinner';
import Icon from '../../icons';
import { withStyles } from '../../helpers/withStylesHelper';
import formatNumber from '../../helpers/formatNumber';
import CollectionPapersControlBtns from './collectionPapersControlBtns';
const styles = require('./collectionPaperList.scss');

interface CollectionPaperListProps {
  itsMine: boolean;
  papersInCollection: PaperInCollection[];
  currentUser: CurrentUser;
  collectionShow: CollectionShowState;
  userCollection: Collection;
  onSelectedPaperInCollection: (paperId: number) => void;
  onRemovePaperFromCollection: (paperIds: number | number[]) => Promise<void>;
}

const CollectionPaperInfo: React.FC<{ collectionShow: CollectionShowState }> = ({ collectionShow }) => {
  return (
    <div className={styles.subHeader}>
      <div>
        <span className={styles.resultPaperCount}>{`${formatNumber(collectionShow.papersTotalCount)} Papers `}</span>
        <span className={styles.resultPaperPageCount}>
          {`(${collectionShow.currentPaperListPage} page of ${formatNumber(collectionShow.totalPaperListPage)} pages)`}
        </span>
      </div>
    </div>
  );
};

const CollectionPaperList: React.FC<CollectionPaperListProps> = props => {
  const {
    itsMine,
    papersInCollection,
    collectionShow,
    userCollection,
    onSelectedPaperInCollection,
    onRemovePaperFromCollection,
  } = props;

  if (collectionShow.isLoadingPaperToCollection) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!userCollection || (!papersInCollection || papersInCollection.length === 0)) {
    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>No paper in this collection.</div>
      </div>
    );
  }

  const collectionPaperList = papersInCollection.map(paper => {
    return (
      <div className={styles.paperItemWrapper} key={paper.paperId}>
        {itsMine && (
          <input
            type="checkbox"
            className={styles.paperCheckBox}
            checked={collectionShow.selectedPaperIds.includes(paper.paperId)}
            onClick={() => onSelectedPaperInCollection(paper.paperId)}
            readOnly
          />
        )}
        <div className={styles.itemWrapper}>
          <PaperItem pageType="collectionShow" actionArea="paperList" paper={paper.paper} omitAbstract />
          <PaperItemButtonGroup pageType="collectionShow" actionArea="paperList" paper={paper.paper} saved />
        </div>
      </div>
    );
  });

  return (
    <>
      <CollectionPapersControlBtns
        itsMine={itsMine}
        collectionShow={collectionShow}
        onRemovePaperCollection={onRemovePaperFromCollection}
      />
      <CollectionPaperInfo collectionShow={collectionShow} />
      {collectionPaperList}
    </>
  );
};

export default withStyles<typeof CollectionPaperList>(styles)(CollectionPaperList);
