import * as React from "react";
import { Link } from "react-router-dom";
import Authors, { AuthorsProps } from "./authors";
import { withStyles } from "../../../helpers/withStylesHelper";
import { trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { Journal } from "../../../model/journal";
import { Paper } from "../../../model/paper";
const styles = require("./publishInfoList.scss");

export interface PublishInfoListProps extends Readonly<AuthorsProps> {
  journal: Journal | null;
  paper: Paper;
  year: number;
}

class PublishInfoList extends React.PureComponent<PublishInfoListProps> {
  public render() {
    const { journal, year, authors, paper } = this.props;

    if (!journal) {
      return null;
    }

    return (
      <div className={styles.publishInfoList}>
        {journal.fullTitle ? (
          <div className={styles.journal}>
            <Icon icon="JOURNAL" />

            <div className={styles.journalText}>
              {year ? (
                <span className={styles.bold}>
                  {year}
                  {` in `}
                </span>
              ) : null}
              <Link
                to={`/journals/${journal.id}`}
                onClick={() => {
                  trackEvent({ category: "Search", action: "Click Journal", label: "" });
                }}
                className={styles.journalName}
              >
                {journal.fullTitle}
              </Link>
              {journal.impactFactor ? (
                <span className={styles.bold}>{` [IF: ${
                  journal.impactFactor ? journal.impactFactor.toFixed(2) : 0
                }]`}</span>
              ) : null}
            </div>
          </div>
        ) : null}

        {authors ? (
          <div className={styles.author}>
            <Icon icon="AUTHOR" />
            <Authors paper={paper} authors={authors} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles<typeof PublishInfoList>(styles)(PublishInfoList);
