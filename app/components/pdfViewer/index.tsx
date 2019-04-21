import * as React from "react";
import Axios from "axios";
import ArticleSpinner from "../common/spinner/articleSpinner";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
import ActionTicketManager from "../../helpers/actionTicketManager";
import { shouldBlockToSignUp } from "../../helpers/shouldBlockToSignUp";
import Icon from "../../icons";
const { Document, Page } = require("react-pdf");
const styles = require("./pdfViewer.scss");

interface PDFViewerProps {
  paperId: number;
  shouldShow: boolean;
  filename: string;
  pdfURL?: string;
  onLoadSuccess: () => void;
  onFailed: () => void;
}

const PDFViewer: React.FunctionComponent<PDFViewerProps> = props => {
  const { pdfURL, shouldShow, onFailed, onLoadSuccess, filename } = props;
  const [isFetching, setIsFetching] = React.useState(false);
  const [PDFBinary, setPDFBinary] = React.useState(null);
  const [PDFObject, setPDFObject] = React.useState(null);
  const [extend, setExtend] = React.useState(false);
  const [hadErrorToLoad, setLoadError] = React.useState(false);
  const [succeedToLoad, setSucceed] = React.useState(false);
  const [pageCountToShow, setPageCountToShow] = React.useState(0);
  const wrapperNode = React.useRef<HTMLDivElement | null>(null);
  const actionTag = extend ? "viewLessPDF" : "viewMorePDF";

  const baseBtnStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "150px",
    height: "40px",
  };
  const readAllBtnStyle: React.CSSProperties = {
    ...baseBtnStyle,
    borderRadius: "27.5px",
    border: "1px solid #bbc2d0",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "1px",
    color: "#34495e",
  };
  const downloadPdfBtnStyle: React.CSSProperties = {
    ...baseBtnStyle,
    color: "#3e7fff",
    border: "1px solid #3e7fff",
    marginLeft: "16px",
  };

  React.useEffect(
    () => {
      if (shouldShow) {
        setIsFetching(true);
        Axios.get(
          `https://lvr8qqubzk.execute-api.us-east-1.amazonaws.com/prod/get-pdf?pdf_url=${pdfURL}&title=${filename}`,
          {
            responseType: "blob",
          }
        )
          .then(res => {
            setPDFBinary(res.data);
            setIsFetching(false);
          })
          .catch(_err => {
            setLoadError(true);
            setIsFetching(false);
            onFailed();
          });
      }
    },
    [pdfURL]
  );

  const getContent = () => {
    if (!PDFObject) return null;

    if (extend) {
      return Array.from(new Array(pageCountToShow), (_el, i) => (
        <Page pdf={PDFObject} width={792} key={i} pageNumber={i + 1} />
      ));
    } else {
      return (
        <>
          <Page pdf={PDFObject} width={792} pageNumber={1} />
        </>
      );
    }
  };

  if (isFetching) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner />
      </div>
    );
  }

  if (shouldShow && PDFBinary) {
    return (
      <div ref={wrapperNode}>
        <Document
          file={PDFBinary}
          error={null}
          loading={
            <div className={styles.loadingContainer}>
              <ArticleSpinner />
            </div>
          }
          onLoadSuccess={(pdf: any) => {
            setPageCountToShow(pdf.numPages);
            setPDFObject(pdf);
            setSucceed(true);
            onLoadSuccess();
          }}
          onLoadError={console.error}
        >
          {getContent()}
        </Document>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", marginBottom: "65px" }}>
          {succeedToLoad && (
            <>
              {extend ? (
                <ScinapseButton
                  gaCategory="PDF viewer"
                  gaAction="download PDF"
                  style={downloadPdfBtnStyle}
                  target="_blank"
                  href={pdfURL}
                  content="Download PDF"
                  onClick={async e => {
                    if (await shouldBlockToSignUp("pdfViewer", "downloadPDF")) {
                      e.preventDefault();
                      return;
                    }
                    trackClickButton("downloadPdf", props.paperId);
                  }}
                  isExternalLink
                  downloadAttr
                />
              ) : (
                <ScinapseButton
                  gaCategory="PDF viewer"
                  gaAction={actionTag}
                  style={readAllBtnStyle}
                  content={
                    <span>
                      READ ALL <Icon icon="ARROW_POINT_TO_UP" className={styles.arrowIcon} />
                    </span>
                  }
                  isLoading={!succeedToLoad && !hadErrorToLoad}
                  disabled={!succeedToLoad}
                  onClick={async () => {
                    if (await shouldBlockToSignUp("pdfViewer", "viewMorePDF")) {
                      return;
                    }
                    trackClickButton(actionTag, props.paperId);
                    setExtend(!extend);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
};

function trackClickButton(actionTag: Scinapse.ActionTicket.ActionTagType, paperId: number) {
  ActionTicketManager.trackTicket({
    pageType: "paperShow",
    actionType: "fire",
    actionArea: "pdfViewer",
    actionTag,
    actionLabel: String(paperId),
  });
}

export default withStyles<typeof PDFViewer>(styles)(PDFViewer);
