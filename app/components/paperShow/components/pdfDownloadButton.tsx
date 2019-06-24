import * as React from 'react';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import SearchingPDFBtn from './searchingPDFBtn';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../../helpers/checkAuthDialog';
import { CurrentUser } from '../../../model/currentUser';
import homeAPI from '../../../api/home';

const styles = require('./pdfSourceButton.scss');

interface PdfDownloadButtonProps {
  paper: Paper;
  isLoading: boolean;
  currentUser: CurrentUser;
  actionArea: Scinapse.ActionTicket.ActionArea;
  onDownloadedPDF: (isDownload: boolean) => void;
  handleSetScrollAfterDownload: () => void;
  wrapperStyle?: React.CSSProperties;
}

const PdfDownloadButton: React.FunctionComponent<PdfDownloadButtonProps> = props => {
  const { paper, isLoading, onDownloadedPDF, handleSetScrollAfterDownload, actionArea } = props;

  function trackActionToClickPdfDownloadBtn() {
    ActionTicketManager.trackTicket({
      pageType: 'paperShow',
      actionType: 'fire',
      actionArea: actionArea,
      actionTag: 'downloadPdf',
      actionLabel: String(paper.id),
    });
  }

  if (!paper) {
    return null;
  }

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  const pdfUrl = paper.bestPdf && paper.bestPdf.url;

  if (pdfUrl) {
    return (
      <a
        aria-label="Scinapse pdf download button in paper"
        className={styles.pdfDownloadBtn}
        href={pdfUrl}
        target="_blank"
        rel="noopener nofollow noreferrer"
        onClick={async e => {
          e.preventDefault();
          trackActionToClickPdfDownloadBtn();

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: actionArea,
            actionLabel: 'downloadPdf',
            userActionType: 'downloadPdf',
          });

          if (isBlocked) {
            return;
          }

          window.open(pdfUrl, '_blank');
          onDownloadedPDF(true);
          await homeAPI.addBasedOnRecommendationPaper(paper.id);
          handleSetScrollAfterDownload();
        }}
      >
        <Icon icon="DOWNLOAD" className={styles.sourceIcon} />
        Download PDF
      </a>
    );
  }

  return null;
};

export default withStyles<typeof PdfDownloadButton>(styles)(PdfDownloadButton);
