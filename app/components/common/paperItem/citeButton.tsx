import React from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { addPaperToRecommendPool } from '../../recommendPool/recommendPoolActions';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
const styles = require('./citeButton.scss');

interface CiteButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  className?: string;
}

const CiteButton: React.FC<CiteButtonProps> = ({ paper, pageType, actionArea, className }) => {
  const dispatch = useDispatch();

  if (!paper.doi) return null;

  return (
    <button
      className={classNames({
        [styles.citeButton]: true,
        [className!]: !!className,
      })}
      onClick={async () => {
        dispatch(addPaperToRecommendPool(paper.id));
        GlobalDialogManager.openCitationDialog(paper.id);
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea: actionArea || pageType,
          actionTag: 'citePaper',
          actionLabel: String(paper.id),
        });
      }}
    >
      <Icon className={styles.citationIcon} icon="CITATION_QUOTE" />

      <span>Cite</span>
    </button>
  );
};

export default withStyles<typeof CiteButton>(styles)(CiteButton);
