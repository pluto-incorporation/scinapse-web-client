import * as React from "react";
import { trackAndOpenLink } from "../../../../helpers/handleGA";
import Icon from "../../../../icons";
import alertToast from "../../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../../helpers/envChecker";

const styles = require("./infoList.scss");

export interface IInfoListProps {
  referenceCount: number;
  citedCount: number;
  citedPaperAvgIF: number;
  plutoScore: number;
  DOI: string;
  articleId: number;
  openSourceLink: () => void;
  searchQuery: string;
}

function copyDOI(DOI: string) {
  const textField = document.createElement("textarea");
  textField.innerText = DOI;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();

  alertToast({
    type: "success",
    message: "Copied!",
  });
}

const InfoList = (props: IInfoListProps) => {
  const origin = EnvChecker.getOrigin();

  return (
    <div className={styles.infoList}>
      <div
        onClick={() => {
          trackAndOpenLink(
            `${origin}/search?page=1&query=${props.searchQuery}&references=${props.articleId}`,
            "searchItemReference",
          );
        }}
        className={styles.referenceButton}
      >
        Ref {props.referenceCount}
      </div>
      <div
        onClick={() => {
          trackAndOpenLink(
            `${origin}/search?page=1&query=${props.searchQuery}&cited=${props.articleId}`,
            "searchItemCited",
          );
        }}
        className={styles.citedButton}
      >
        Cited {props.citedCount}
      </div>
      {/* <span className={styles.explanation}>Cited Paper Avg IF</span>
      <span className={styles.citedPaperAvgIF}>{props.citedPaperAvgIF}</span>
      <div className={styles.separatorLine} />
      <span className={styles.explanation}>Pltuo Score</span>
      <span className={styles.pltuoScore}>{props.plutoScore}</span> */}
      <div className={styles.rightBox}>
        <div onClick={props.openSourceLink} className={styles.sourceButton}>
          <Icon className={styles.articleSourceIconWrapper} icon="ARTICLE_SOURCE" />
          Source
        </div>
        {props.DOI ? (
          <div
            onClick={() => {
              copyDOI(props.DOI);
            }}
            className={styles.copyDOIButton}
          >
            Copy DOI
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfoList;
