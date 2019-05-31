import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import { formulaeToHTMLStr } from '../../../helpers/displayFormula';
import actionTicketManager from '../../../helpers/actionTicketManager';
import { Paper } from '../../../model/paper';
import { ActionCreators } from '../../../actions/actionTypes';
import Icon from '../../../icons';
const styles = require('./title.scss');

export interface TitleProps extends RouteComponentProps<any> {
  dispatch: Dispatch<any>;
  paper: Paper;
  source: string;
  pageType: Scinapse.ActionTicket.PageType;
  shouldBlockUnverifiedUser: boolean;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  currentPage?: number;
}

class Title extends React.Component<TitleProps> {
  public shouldComponentUpdate(nextProps: TitleProps) {
    if (this.props.paper.id !== nextProps.paper.id) {
      return true;
    }
    return false;
  }

  public render() {
    const { paper } = this.props;
    const title = paper.title;

    if (!title) {
      return null;
    }
    // for removing first or last space or trash value of content
    const trimmedTitle = title
      .replace(/^ /gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/#[A-Z0-9]+#/g, '');

    return (
      <div>
        <Link
          to={`/papers/${paper.id}`}
          onClick={() => {
            this.handleClickTitle(false);
          }}
          dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(trimmedTitle) }}
          className={styles.title}
        />
        <a
          href={`/papers/${paper.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalIconWrapper}
        >
          <Icon
            onClick={() => {
              this.handleClickTitle(true);
            }}
            icon="NEW_TAB"
            className={styles.externalIcon}
          />
        </a>
      </div>
    );
  }

  private handleClickTitle = (fromNewTab?: boolean) => {
    const { dispatch, pageType, actionArea, paper } = this.props;
    actionTicketManager.trackTicket({
      pageType,
      actionType: 'fire',
      actionArea: actionArea || pageType,
      actionTag: 'paperShow',
      actionLabel: String(paper.id),
    });

    if (fromNewTab) {
      actionTicketManager.trackTicket({
        pageType,
        actionType: 'fire',
        actionArea: 'titleNewTab',
        actionTag: 'paperShow',
        actionLabel: String(paper.id),
      });
    }

    if (paper.abstractHighlighted || paper.titleHighlighted) {
      dispatch(
        ActionCreators.setHighlightContentInPaperShow({
          title: paper.titleHighlighted || '',
          abstract: paper.abstractHighlighted || '',
        })
      );
    }
  };
}

export default connect()(withRouter(withStyles<typeof Title>(styles)(Title)));
