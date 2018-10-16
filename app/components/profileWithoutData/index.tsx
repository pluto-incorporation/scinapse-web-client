import * as React from "react";
import { CurrentUser } from "../../model/currentUser";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseButton from "../common/scinapseButton";
const styles = require("./profileWithoutData.scss");

interface ProfileWithoutDataProps {
  currentUser: CurrentUser;
  handleClickCreateProfile: (step: number) => void;
}

@withStyles<typeof ProfileWithoutData>(styles)
class ProfileWithoutData extends React.PureComponent<ProfileWithoutDataProps, {}> {
  public render() {
    const { handleClickCreateProfile } = this.props;

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.headline}>You are not connected to any authors right now</div>
        <div className={styles.description}>
          You should match your profile with academic papers' author. Make your own profile and get CV page to share.
        </div>
        <ScinapseButton
          style={{ backgroundColor: "#3e7fff" }}
          gaCategory="Profile Action"
          buttonText="Create Profile"
          onClick={() => {
            handleClickCreateProfile(1);
          }}
        />
      </div>
    );
  }
}

export default ProfileWithoutData;
