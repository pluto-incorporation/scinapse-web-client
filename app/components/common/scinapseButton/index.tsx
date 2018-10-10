import * as React from "react";
import { Link } from "react-router-dom";
import * as H from "history";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./scinapseButton.scss");

interface ScinapseButtonProps {
  buttonText: string;
  gaCategory: string;
  isReactRouterLink?: boolean;
  isExternalLink?: boolean;
  href?: string;
  to?: H.LocationDescriptor;
  style?: React.CSSProperties;
  onClick?: ((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void);
}

class ScinapseButton extends React.PureComponent<ScinapseButtonProps> {
  public render() {
    const { buttonText, isReactRouterLink, isExternalLink, to, href, style } = this.props;

    if (isReactRouterLink && to) {
      return (
        <Link style={style} onClick={this.handleClickEvent} className={styles.button} to={to}>
          {buttonText}
        </Link>
      );
    } else if (isExternalLink && href) {
      return (
        <a style={style} onClick={this.handleClickEvent} className={styles.button} href={href}>
          {buttonText}
        </a>
      );
    }

    return (
      <button style={style} onClick={this.handleClickEvent} className={styles.button}>
        {buttonText}
      </button>
    );
  }

  private handleClickEvent = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const { gaCategory, buttonText, onClick } = this.props;

    trackEvent({
      category: gaCategory,
      action: `Click ${buttonText}`,
      label: buttonText,
    });

    if (onClick) {
      onClick(e);
    }
  };
}

export default withStyles<typeof ScinapseButton>(styles)(ScinapseButton);
