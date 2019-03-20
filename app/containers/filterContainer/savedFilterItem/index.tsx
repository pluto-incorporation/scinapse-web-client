import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Filter } from "../../../api/member";
import Icon from "../../../icons";
const styles = require("./savedFilterItem.scss");

interface SavedFilterItemProps {
  searchInput: string;
  sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
  savedFilter: Filter;
  onClickFilterItem: (query: string, sort: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS, filter: Filter) => void;
  onClickDeleteBtn: () => void;
  key: number;
}

const SavedFilterItem: React.FunctionComponent<SavedFilterItemProps> = props => {
  const { searchInput, sort, onClickFilterItem, savedFilter, onClickDeleteBtn } = props;

  return (
    <li onClick={() => onClickFilterItem(searchInput, sort, savedFilter)} className={styles.filterItemWrapper}>
      <div className={styles.filterItem}>
        <span className={styles.filterItemEmoji}>{savedFilter.emoji}</span>
        <span className={styles.filterItemTitle}>{savedFilter.name}</span>
        <span
          className={styles.deleteIconWrapper}
          onClick={e => {
            e.stopPropagation();
            onClickDeleteBtn();
          }}
        >
          <Icon icon="TRASH_CAN" className={styles.trashIcon} />
        </span>
      </div>
    </li>
  );
};

export default withStyles<typeof SavedFilterItem>(styles)(SavedFilterItem);
