import * as React from "react";
import { Link } from "react-router-dom";
import { Author } from "../../../model/author/author";
import { trackEvent } from "../../../helpers/handleGA";
import HIndexBox from "../hIndexBox";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./coAuthor.scss");

interface CoAuthorProps {
  author: Author;
}

const CoAuthor = (props: CoAuthorProps) => {
  const author = props.author;
  return (
    <Link
      className={styles.authorItem}
      to={`/authors/${author.id}`}
      onClick={() => {
        trackEvent({
          category: "Flow to Author Show",
          action: "Click Co-Author",
          label: "Author Show",
        });
      }}
    >
      <div className={styles.coAuthorItemHeader}>
        <div className={styles.coAuthorName}>
          {author.name}{" "}
          {author.isLayered ? (
            <div title="Verification Author" className={styles.contactIconWrapper}>
              <Icon icon="OCCUPIED" className={styles.occupiedIcon} />
            </div>
          ) : null}
        </div>
        <div className={styles.hIndexWrapper}>
          <HIndexBox hIndex={author.hIndex} />
        </div>
      </div>
      <span className={styles.coAuthorAffiliation}>
        {author.lastKnownAffiliation ? author.lastKnownAffiliation.name : ""}
      </span>
    </Link>
  );
};

export default withStyles<typeof CoAuthor>(styles)(CoAuthor);
