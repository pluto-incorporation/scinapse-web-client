import * as React from "react";
import InfoList from "./infoList";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";
import { Paper } from "../../../model/paper";
import { CurrentUser } from "../../../model/currentUser";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./paperItem.scss");

export interface PaperItemProps {
  paper: Paper;
  refererSection: string;
  currentUser: CurrentUser;
  paperNote?: string;
  searchQueryText?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}

class PaperItem extends React.PureComponent<PaperItemProps> {
  public render() {
    const { searchQueryText, currentUser, paper, wrapperClassName, wrapperStyle, refererSection } = this.props;
    const { title, authors, year, doi, abstract, urls, journal } = paper;

    let source: string;
    if (!!doi) {
      source = `https://doi.org/${doi}`;
    } else if (urls && urls.length > 0) {
      source = urls[0].url;
    } else {
      source = "";
    }

    return (
      <div style={wrapperStyle} className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
        <div className={styles.contentSection}>
          <Title
            refererSection={refererSection}
            title={title}
            paperId={paper.id}
            searchQueryText={searchQueryText}
            source={source}
          />
          <PublishInfoList journal={journal} year={year} authors={authors} />
          <Abstract abstract={abstract} searchQueryText={searchQueryText} />
          <InfoList currentUser={currentUser} paper={paper} />
        </div>
      </div>
    );
  }
}

export default withStyles<typeof PaperItem>(styles)(PaperItem);
