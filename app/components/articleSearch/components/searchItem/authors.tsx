import * as React from "react";
import { List } from "immutable";
import Tooltip from "../../../common/tooltip/tooltip";
import { IAuthorRecord } from "../../../../model/author";

const styles = require("./authors.scss");
const MINIMUM_SHOWING_AUTHOR_NUMBER = 3;

export interface IAuthorsProps {
  authors: List<IAuthorRecord>;
  isAuthorsOpen: boolean;
  toggleAuthors: () => void;
}

const Authors = (props: IAuthorsProps) => {
  const { authors, isAuthorsOpen, toggleAuthors } = props;
  const isAuthorsSameLessThanMinimumShowingAuthorNumber = authors.size <= MINIMUM_SHOWING_AUTHOR_NUMBER;

  if (isAuthorsSameLessThanMinimumShowingAuthorNumber) {
    const authorItems = mapAuthorNodeToLastIndex(authors, authors.size - 1);

    return <span className={styles.authors}>{authorItems}</span>;
  } else if (!isAuthorsOpen) {
    const authorItems = mapAuthorNodeToLastIndex(authors, MINIMUM_SHOWING_AUTHOR_NUMBER);

    return (
      <span className={styles.authors}>
        {authorItems}
        <span className={styles.toggleAuthorsButton} onClick={toggleAuthors}>
          {` ... (${authors.size - MINIMUM_SHOWING_AUTHOR_NUMBER} others)`}
        </span>
      </span>
    );
  } else {
    const authorItems = mapAuthorNodeToLastIndex(authors, authors.size - 1);

    return (
      <span className={styles.authors}>
        {authorItems}
        <span className={styles.toggleAuthorsButton} onClick={toggleAuthors}>
          {` ... (less)`}
        </span>
      </span>
    );
  }
};

function getHIndexTooltip(hIndex: number) {
  if (!!hIndex) {
    return (
      <span className={styles.authorHIndex}>
        <Tooltip
          className={styles.authorHIndexTooltip}
          left={-37}
          top={-26}
          iconTop={-9}
          content={`h - index : ${hIndex}`}
          type="h-index"
        />
        {hIndex}
      </span>
    );
  }
}

function getAuthorOrganization(organization: string) {
  if (!!organization) {
    const trimmedOrganization = organization
      .split(",")
      .slice(0, 2)
      .join();

    return `(${trimmedOrganization})`;
  }
}

function mapAuthorNodeToLastIndex(authors: List<IAuthorRecord>, lastIndex: number) {
  return authors.slice(0, lastIndex).map((author, index) => {
    const isLastAuthor = index !== authors.size - 1;

    return (
      <span className={styles.author} key={`author_${index}`}>
        <span className={styles.authorName}>{`${author.name} `}</span>
        {getHIndexTooltip(author.hIndex)}
        {getAuthorOrganization(author.organization)}
        {isLastAuthor ? <span className={styles.authorName}>{`, `}</span> : null}
      </span>
    );
  });
}
export default Authors;
