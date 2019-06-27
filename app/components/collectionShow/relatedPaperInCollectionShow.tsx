import * as React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import CollectionAPI from '../../api/collection';
import { Paper } from '../../model/paper';
import PaperItem from '../common/paperItem';
import ArticleSpinner from '../common/spinner/articleSpinner';
import { useObserver } from '../../hooks/useIntersectionHook';
import { ActionTicketParams } from '../../helpers/actionTicketManager/actionTicket';
const styles = require('./relatedPaperInCollectionShow.scss');

interface RelatedPaperInCollectionShowProps {
  collectionId: number;
}

const RelatedPaperItem: React.FunctionComponent<{ paper: Paper }> = props => {
  const { paper } = props;
  const actionTicketContext: ActionTicketParams = {
    pageType: 'collectionShow',
    actionType: 'view',
    actionArea: 'relatedPaperList',
    actionTag: 'viewRelatedPaper',
    actionLabel: String(paper.id),
  };

  const { elRef } = useObserver(0.1, actionTicketContext);

  return (
    <div ref={elRef}>
      <PaperItem
        key={paper.id}
        paper={paper}
        omitAbstract={true}
        pageType="collectionShow"
        actionArea="relatedPaperList"
        wrapperClassName={styles.paperItemWrapper}
      />
    </div>
  );
};

const RelatedPaperInCollectionShow: React.FunctionComponent<RelatedPaperInCollectionShowProps> = props => {
  const { collectionId } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [relatedPapers, setRelatedPapers] = React.useState<Paper[]>([]);

  React.useEffect(
    () => {
      setIsLoading(true);
      CollectionAPI.getRelatedPaperInCollection(collectionId).then(result => {
        setRelatedPapers(result.content);
        setIsLoading(false);
      });
    },
    [collectionId]
  );

  if (relatedPapers.length === 0) {
    return null;
  }

  const relatedPaperItems = relatedPapers.map((paper, index) => {
    if (index < 3) {
      return (
        <div key={paper.id}>
          <RelatedPaperItem paper={paper} />
        </div>
      );
    }
  });

  return (
    <div className={styles.relatedPaperContainer}>
      <div className={styles.titleContext}>📄 How about these papers?</div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      ) : (
        relatedPaperItems
      )}
    </div>
  );
};

export default withStyles<typeof RelatedPaperInCollectionShow>(styles)(RelatedPaperInCollectionShow);
