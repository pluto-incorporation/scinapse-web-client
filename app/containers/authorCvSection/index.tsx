import * as React from "react";
import { denormalize } from "normalizr";
import { Dispatch, connect } from "react-redux";
import { ConnectedAuthorShowState } from "../connectedAuthorShow/reducer";
import { LayoutState } from "../../components/layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { AppState } from "../../reducers";
import { CurrentUser } from "../../model/currentUser";
import { authorSchema, Author } from "../../model/author/author";
import { profileSchema, Profile, CVInfoType } from "../../model/profile";
import Icon from "../../icons";
import AwardForm, { AwardFormState } from "../../components/authorCV/awardForm";
import { postNewAuthorCVInfo, removeAuthorCvInfo } from "../../actions/author";
import EducationForm, { EducationFormState } from "../../components/authorCV/educationForm";
import ExperienceForm, { ExperienceFormState } from "../../components/authorCV/experienceForm";
import ExperienceItem from "../../components/authorCV/experienceItem";
import EducationItem from "../../components/authorCV/educationItem";
import AwardItem from "../../components/authorCV/awardItem";
import { ActionCreators } from "../../actions/actionTypes";
import alertToast from "../../helpers/makePlutoToastAction";
const styles = require("./authorCvSection.scss");

interface AuthorCvSectionState {
  isOpenAwardForm: boolean;
  isOpenEducationForm: boolean;
  isOpenExperienceForm: boolean;
  isLoadingAwardForm: boolean;
  isLoadingEducationForm: boolean;
  isLoadingExperienceForm: boolean;
}

interface AuthorCvSectionProps {
  layout: LayoutState;
  author: Author;
  authorShow: ConnectedAuthorShowState;
  currentUser: CurrentUser;
  profile: Profile;
  dispatch: Dispatch<any>;
}

export function getFormattingDate(year: string, month: string) {
  return `${year}-${month}`;
}

export function getMonthOptionItems() {
  const monthArr = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const monthItems = monthArr.map(m => {
    return (
      <option value={m} key={m}>
        {parseInt(m, 10)}
      </option>
    );
  });

  return monthItems;
}

@withStyles<typeof AuthorCvSection>(styles)
class AuthorCvSection extends React.PureComponent<AuthorCvSectionProps, AuthorCvSectionState> {
  public constructor(props: AuthorCvSectionProps) {
    super(props);

    this.state = {
      isOpenAwardForm: false,
      isOpenEducationForm: false,
      isOpenExperienceForm: false,
      isLoadingAwardForm: false,
      isLoadingEducationForm: false,
      isLoadingExperienceForm: false,
    };
  }

  public render() {
    return (
      <div className={styles.leftContentWrapper}>
        {this.getEducationArea()}
        {this.getExperienceArea()}
        {this.getAwardArea()}
      </div>
    );
  }

  private getEducationArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Education</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.getEducationForm()}
        {this.getEducationList()}
      </div>
    );
  };

  private getEducationForm = () => {
    const { isOpenEducationForm, isLoadingEducationForm } = this.state;

    return isOpenEducationForm ? (
      <EducationForm
        wrapperStyle={{ display: "inline-flex", position: "relative" }}
        inputStyle={{
          color: "#666d7c",
          fontSize: "13px",
          lineHeight: "1.54",
          fontFamily: "Roboto",
          padding: "8px",
        }}
        monthItems={getMonthOptionItems()}
        handleClose={this.handleToggleAuthorCVForm("educations")}
        isOpen={true}
        isLoading={isLoadingEducationForm}
        handleSubmitForm={this.handleAddCVInfo("educations")}
        initialValues={{
          degree: "",
          department: "",
          is_current: false,
          institution_name: "",
          institution_id: null,
          start_date: "",
          start_date_year: "",
          start_date_month: "",
          end_date: "",
          end_date_year: "",
          end_date_month: "",
        }}
      />
    ) : (
      <div className={styles.buttonWrapper}>
        <span className={styles.openFormButton} onClick={this.handleToggleAuthorCVForm("educations")}>
          <Icon className={styles.plusIcon} icon="SMALL_PLUS" /> Add more
        </span>
      </div>
    );
  };

  private getEducationList = () => {
    const { profile, author } = this.props;
    if (profile.educations && profile.educations.length > 0) {
      const educations = profile.educations.map(education => {
        return (
          <EducationItem
            authorId={author.id}
            key={education.id}
            education={education}
            handleRemoveItem={this.handleDeleteCVInfo("educations")}
          />
        );
      });

      return educations;
    }

    return null;
  };

  private getExperienceArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Experience</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.getExperienceForm()}
        {this.getExperienceList()}
      </div>
    );
  };

  private getExperienceForm = () => {
    const { isOpenExperienceForm, isLoadingExperienceForm } = this.state;

    return isOpenExperienceForm ? (
      <ExperienceForm
        wrapperStyle={{ display: "inline-flex", position: "relative" }}
        inputStyle={{
          color: "#666d7c",
          fontSize: "13px",
          lineHeight: "1.54",
          fontFamily: "Roboto",
          padding: "8px",
        }}
        monthItems={getMonthOptionItems()}
        handleClose={this.handleToggleAuthorCVForm("experiences")}
        isOpen={true}
        isLoading={isLoadingExperienceForm}
        handleSubmitForm={this.handleAddCVInfo("experiences")}
        initialValues={{
          department: "",
          description: "",
          position: "",
          institution_id: null,
          institution_name: "",
          is_current: false,
          start_date: "",
          start_date_year: "",
          start_date_month: "",
          end_date: "",
          end_date_year: "",
          end_date_month: "",
        }}
      />
    ) : (
      <div className={styles.buttonWrapper}>
        <span className={styles.openFormButton} onClick={this.handleToggleAuthorCVForm("experiences")}>
          <Icon className={styles.plusIcon} icon="SMALL_PLUS" /> Add more
        </span>
      </div>
    );
  };

  private getExperienceList = () => {
    const { profile, author } = this.props;
    if (profile.experiences && profile.experiences.length > 0) {
      const experiences = profile.experiences.map(experience => {
        return (
          <ExperienceItem
            authorId={author.id}
            key={experience.id}
            experience={experience}
            handleRemoveItem={this.handleDeleteCVInfo("experiences")}
          />
        );
      });

      return experiences;
    }

    return null;
  };

  private getAwardArea = () => {
    return (
      <div className={styles.areaWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Award</span>
        </div>
        <div className={styles.sectionDescription} />
        {this.getAwardForm()}
        {this.getAwardList()}
      </div>
    );
  };

  private getAwardForm = () => {
    const { isOpenAwardForm, isLoadingAwardForm } = this.state;

    return isOpenAwardForm ? (
      <AwardForm
        monthItems={getMonthOptionItems()}
        handleClose={this.handleToggleAuthorCVForm("awards")}
        isOpen={true}
        isLoading={isLoadingAwardForm}
        handleSubmitForm={this.handleAddCVInfo("awards")}
        initialValues={{
          title: "",
          received_date: "",
          received_date_month: "",
          received_date_year: "",
        }}
      />
    ) : (
      <div className={styles.buttonWrapper}>
        <span className={styles.openFormButton} onClick={this.handleToggleAuthorCVForm("awards")}>
          <Icon className={styles.plusIcon} icon="SMALL_PLUS" /> Add more
        </span>
      </div>
    );
  };

  private getAwardList = () => {
    const { profile, author } = this.props;

    if (profile.awards && profile.awards.length > 0) {
      const awards = profile.awards.map(award => {
        return (
          <AwardItem
            authorId={author.id}
            key={award.id}
            award={award}
            handleRemoveItem={this.handleDeleteCVInfo("awards")}
          />
        );
      });

      return awards;
    }
    return null;
  };

  private handleDeleteCVInfo = (cvInfoType: keyof CVInfoType) => (cvInfoId: string) => {
    const { author, dispatch } = this.props;
    if (confirm(`Do you really want to delete the ${cvInfoType.slice(0, -1)} data?`)) {
      dispatch(removeAuthorCvInfo(cvInfoType, author.id, cvInfoId));
    }

    return null;
  };

  private handleAddCVInfo = (cvInfoType: keyof CVInfoType) => async (
    cvInfo: EducationFormState | ExperienceFormState | AwardFormState
  ) => {
    const { author, dispatch } = this.props;

    this.handleLoadingFlagAuthorCVForm(cvInfoType);

    if (cvInfoType === "awards") {
      const awardInfoType = cvInfo as AwardFormState;
      awardInfoType.received_date = getFormattingDate(
        awardInfoType.received_date_year,
        awardInfoType.received_date_month
      );
    } else if (cvInfoType === "educations") {
      const educationInfoType = cvInfo as EducationFormState;
      educationInfoType.start_date = getFormattingDate(
        educationInfoType.start_date_year,
        educationInfoType.start_date_month
      );
      educationInfoType.end_date = getFormattingDate(educationInfoType.end_date_year, educationInfoType.end_date_month);
    } else if (cvInfoType === "experiences") {
      const experienceInfoType = cvInfo as ExperienceFormState;
      experienceInfoType.start_date = getFormattingDate(
        experienceInfoType.start_date_year,
        experienceInfoType.start_date_month
      );
      experienceInfoType.end_date = getFormattingDate(
        experienceInfoType.end_date_year,
        experienceInfoType.end_date_month
      );
    }

    try {
      await dispatch(postNewAuthorCVInfo(cvInfoType, author.id, cvInfo));
      this.handleLoadingFlagAuthorCVForm(cvInfoType);
      this.handleToggleAuthorCVForm(cvInfoType)();
    } catch (err) {
      dispatch(ActionCreators.failToAddProfileCvData());
      this.handleLoadingFlagAuthorCVForm(cvInfoType);
      alertToast({
        type: "error",
        message: `Had an error to delete ${cvInfoType} data.`,
      });
    }
  };

  private handleToggleAuthorCVForm = (formType: keyof CVInfoType) => () => {
    const { isOpenAwardForm, isOpenEducationForm, isOpenExperienceForm } = this.state;

    switch (formType) {
      case "awards":
        this.setState(prevState => ({ ...prevState, isOpenAwardForm: !isOpenAwardForm }));
        break;
      case "educations":
        this.setState(prevState => ({
          ...prevState,
          isOpenEducationForm: !isOpenEducationForm,
        }));
        break;
      case "experiences":
        this.setState(prevState => ({
          ...prevState,
          isOpenExperienceForm: !isOpenExperienceForm,
        }));
        break;
      default:
        break;
    }
  };

  private handleLoadingFlagAuthorCVForm = (formType: keyof CVInfoType) => {
    const { isLoadingAwardForm, isLoadingEducationForm, isLoadingExperienceForm } = this.state;

    switch (formType) {
      case "awards":
        this.setState(prevState => ({ ...prevState, isLoadingAwardForm: !isLoadingAwardForm }));
        break;
      case "educations":
        this.setState(prevState => ({ ...prevState, isLoadingEducationForm: !isLoadingEducationForm }));
        break;
      case "experiences":
        this.setState(prevState => ({ ...prevState, isLoadingExperienceForm: !isLoadingExperienceForm }));
        break;
      default:
        break;
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    authorShow: state.connectedAuthorShow,
    currentUser: state.currentUser,
    profile: denormalize(state.connectedAuthorShow.authorId, profileSchema, state.entities),
    author: denormalize(state.connectedAuthorShow.authorId, authorSchema, state.entities),
  };
}

export default connect(mapStateToProps)(AuthorCvSection);
