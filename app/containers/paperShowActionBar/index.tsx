import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '../../helpers/withStylesHelper';
import FullTextDialog from './components/requestFulltextDialog';
import PaperShowCollectionControlButton from '../paperShowCollectionControlButton';
import CiteBox from './components/citeBox';
import { Paper } from '../../model/paper';
import { CurrentUser } from '../../model/currentUser';
import SourceButton from '../../components/paperShow/components/sourceButton';
import ViewFullTextBtn from '../../components/paperShow/components/viewFullTextBtn';
import RequestFullTextBtn from './components/fullTextRequestBtn';
import { addPaperToRecommendPool, openRecommendPoolDialog } from '../../components/recommendPool/recommendPoolActions';
const s = require('./actionBar.scss');

interface PaperShowActionBarProps {
  paper: Paper;
  dispatch: Dispatch<any>;
  hasPDFFullText: boolean;
  isLoadingPDF: boolean;
  currentUser: CurrentUser;
  handleClickFullText: () => void;
  lastRequestedDate: string | null;
}

const PaperShowActionBar: React.FC<PaperShowActionBarProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const requestFullTextBtnEl = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className={s.actionBar}>
      <div className={s.actions}>
        <div className={s.leftSide}>
          {!props.hasPDFFullText ? (
            <div className={s.actionItem} ref={requestFullTextBtnEl}>
              <RequestFullTextBtn
                actionArea="paperDescription"
                isLoading={props.isLoadingPDF}
                paperId={props.paper.id}
                onClick={() => {
                  setIsOpen(true);
                  props.dispatch(addPaperToRecommendPool(props.paper.id));
                }}
                lastRequestedDate={props.lastRequestedDate}
              />
            </div>
          ) : (
            <div className={s.actionItem}>
              <ViewFullTextBtn
                paperId={props.paper.id}
                handleClickFullText={props.handleClickFullText}
                isLoading={props.isLoadingPDF}
              />
            </div>
          )}
          {props.paper.bestPdf && (
            <div className={s.actionItem}>
              <SourceButton paper={props.paper} showFullText={props.paper.bestPdf.hasBest} />
            </div>
          )}
          <div className={s.actionItem}>
            <CiteBox actionArea="paperDescription" paper={props.paper} />
          </div>
          <FullTextDialog
            paperId={props.paper.id}
            isOpen={isOpen}
            onClose={async () => {
              setIsOpen(false);
              props.dispatch(openRecommendPoolDialog('paperShow', 'requestFullTextBtn'));
            }}
          />
        </div>
        <div className={s.rightSide}>
          <PaperShowCollectionControlButton paperId={props.paper.id} />
        </div>
      </div>
    </div>
  );
};

export default connect()(withStyles<typeof PaperShowActionBar>(s)(PaperShowActionBar));
