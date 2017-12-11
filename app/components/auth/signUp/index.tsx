import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import { ISignUpStateRecord, IFormErrorRecord, SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP } from "./records";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { AuthInputBox } from "../../common/inputBox/authInputBox";
import { trackAction } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { ICreateNewAccountParams } from "../../../api/auth";

const styles = require("./signUp.scss");

interface ISignUpContainerProps extends DispatchProp<ISignUpContainerMappedState> {
  signUpState: ISignUpStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
}

interface ISignUpContainerMappedState {
  signUpState: ISignUpStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    signUpState: state.signUp,
  };
}

class SignUp extends React.PureComponent<ISignUpContainerProps, {}> {
  private handleEmailChange = (email: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEmailInput(email));
  };

  private checkValidEmailInput = () => {
    const { dispatch } = this.props;
    const { email } = this.props.signUpState;

    dispatch(Actions.checkValidEmailInput(email));
  };

  private checkDuplicatedEmail = () => {
    const { dispatch } = this.props;
    const { email } = this.props.signUpState;

    dispatch(Actions.checkDuplicatedEmail(email));
  };

  private handlePasswordChange = (password: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changePasswordInput(password));
  };

  private checkValidPasswordInput = () => {
    const { dispatch } = this.props;
    const { password } = this.props.signUpState;

    dispatch(Actions.checkValidPasswordInput(password));
  };

  private handleNameChange = (name: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeNameInput(name));
  };

  private checkValidNameInput = () => {
    const { dispatch } = this.props;
    const { name } = this.props.signUpState;

    dispatch(Actions.checkValidNameInput(name));
  };

  private handleAffiliationChange = (affiliation: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAffiliationInput(affiliation));
  };

  private checkValidAffiliationInput = () => {
    const { dispatch } = this.props;
    const { affiliation } = this.props.signUpState;

    dispatch(Actions.checkValidAffiliationInput(affiliation));
  };

  private removeFormErrorMessage = (type: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.removeFormErrorMessage(type));
  };

  private onFocusInput = (type: SIGN_UP_ON_FOCUS_TYPE) => {
    const { dispatch } = this.props;

    dispatch(Actions.onFocusInput(type));
  };

  private onBlurInput = () => {
    const { dispatch } = this.props;

    dispatch(Actions.onBlurInput());
  };

  private createNewAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { signUpState, dispatch, handleChangeDialogType } = this.props;
    const { email, password, name, affiliation } = signUpState;
    const params: ICreateNewAccountParams = {
      email,
      password,
      name,
      affiliation,
    };

    dispatch(Actions.createNewAccount(params, handleChangeDialogType !== undefined));
  };

  private checkValidateStep = (destinationStep: SIGN_UP_STEP) => {
    const { dispatch, signUpState } = this.props;

    dispatch(Actions.checkValidateStep(destinationStep, signUpState));
  };

  private getAuthNavBar = (handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void = null) => {
    if (!handleChangeDialogType) {
      return (
        <div className={styles.authNavBar}>
          <Link
            to="/users/sign_in"
            onClick={() => trackAction("/users/sign_in", "signUpAuthNavBar")}
            className={styles.signInLink}
          >
            SIGN IN
          </Link>
          <Link
            to="/users/sign_up"
            onClick={() => trackAction("/users/sign_up", "signUpAuthNavBar")}
            className={styles.signUpLink}
          >
            SIGN UP
          </Link>
        </div>
      );
    } else {
      return (
        <div className={styles.authNavBar}>
          <div
            className={styles.signInLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_IN);
            }}
          >
            SIGN IN
          </div>
          <div
            className={styles.signUpLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_UP);
            }}
          >
            SIGN UP
          </div>
        </div>
      );
    }
  };

  private getErrorMessage = (formError: IFormErrorRecord) => {
    return (
      <div
        className={styles.errorContent}
        style={
          formError.hasError
            ? {
                display: "flex",
              }
            : null
        }
      >
        {formError.errorMessage}
      </div>
    );
  };

  private getSubmitButton = (isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className={styles.loadingSubmitButton}>
          <ButtonSpinner className={styles.buttonSpinner} />
          SIGN UP
        </div>
      );
    } else {
      return (
        <button type="submit" className={styles.submitButton}>
          SIGN UP
        </button>
      );
    }
  };

  private goBack = () => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSignUpStep(SIGN_UP_STEP.FIRST));
  };

  public render() {
    const { signUpState, handleChangeDialogType } = this.props;
    const { hasErrorCheck, isLoading, onFocus, step, email, password, affiliation, name } = signUpState;

    switch (step) {
      case SIGN_UP_STEP.FIRST:
        return (
          <div className={styles.signUpContainer}>
            <form
              onSubmit={() => {
                this.checkValidateStep(SIGN_UP_STEP.WITH_EMAIL);
              }}
              className={styles.formContainer}
            >
              {this.getAuthNavBar(handleChangeDialogType)}
              <AuthInputBox
                onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.EMAIL}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("email");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.EMAIL);
                }}
                onChangeFunc={this.handleEmailChange}
                onBlurFunc={() => {
                  this.checkValidEmailInput();
                  this.checkDuplicatedEmail();
                  this.onBlurInput();
                }}
                defaultValue={email}
                placeHolder="E-mail"
                hasError={hasErrorCheck.email.hasError}
                inputType="email"
                iconName="EMAIL_ICON"
              />
              {this.getErrorMessage(hasErrorCheck.email)}
              <AuthInputBox
                onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.PASSWORD}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("password");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.PASSWORD);
                }}
                onChangeFunc={this.handlePasswordChange}
                onBlurFunc={() => {
                  this.checkValidPasswordInput();
                  this.onBlurInput();
                }}
                defaultValue={password}
                placeHolder="Password"
                hasError={hasErrorCheck.password.hasError}
                inputType="password"
                iconName="PASSWORD_ICON"
              />
              {this.getErrorMessage(hasErrorCheck.password)}
              {this.getSubmitButton(isLoading)}
              <div className={styles.orSeparatorBox}>
                <div className={styles.dashedSeparator} />
                <div className={styles.orContent}>or</div>
                <div className={styles.dashedSeparator} />
              </div>
              <div className={styles.facebookLogin}>
                <Icon className={styles.iconWrapper} icon="FACEBOOK_LOGO" />
                SIGN UP WITH FACEBOOK
              </div>
              <div className={styles.googleLogin}>
                <Icon className={styles.iconWrapper} icon="GOOGLE_LOGO" />
                SIGN UP WITH GOOGLE
              </div>
              <div className={styles.orcidLogin}>
                <Icon className={styles.iconWrapper} icon="ORCID_LOGO" />
                SIGN UP WITH ORCID
              </div>
            </form>
          </div>
        );
      case SIGN_UP_STEP.WITH_EMAIL:
        return (
          <div className={styles.signUpContainer}>
            <form onSubmit={this.createNewAccount} className={styles.formContainer}>
              {this.getAuthNavBar(handleChangeDialogType)}
              <div className={styles.additionalInformation}>ADDITIONAL INFORMATION</div>
              <div className={styles.staticFormBox}>
                <Icon className={styles.iconWrapper} icon="EMAIL_ICON" />
                {email}
              </div>
              <AuthInputBox
                onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.NAME}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("name");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.NAME);
                }}
                onChangeFunc={this.handleNameChange}
                onBlurFunc={() => {
                  this.checkValidNameInput();
                  this.onBlurInput();
                }}
                defaultValue={name}
                placeHolder="Full Name"
                hasError={hasErrorCheck.name.hasError}
                inputType="string"
                iconName="FULL_NAME_ICON"
              />
              {this.getErrorMessage(hasErrorCheck.name)}
              <AuthInputBox
                onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.AFFILIATION}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("affiliation");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.AFFILIATION);
                }}
                onChangeFunc={this.handleAffiliationChange}
                onBlurFunc={() => {
                  this.checkValidAffiliationInput();
                  this.onBlurInput();
                }}
                defaultValue={affiliation}
                placeHolder="Affiliation"
                hasError={hasErrorCheck.affiliation.hasError}
                inputType="string"
                iconName="AFFILIATION_ICON"
              />
              {this.getErrorMessage(hasErrorCheck.affiliation)}
              <div style={{ height: 63 }} />
              {this.getSubmitButton(isLoading)}
              <div onClick={this.goBack} className={styles.goBackButton}>
                GO BACK
              </div>
            </form>
          </div>
        );
      case SIGN_UP_STEP.WITH_SOCIAL:
        return (
          <div className={styles.signUpContainer}>
            <form onSubmit={this.createNewAccount} className={styles.formContainer}>
              {this.getAuthNavBar(handleChangeDialogType)}
              <div className={styles.additionalInformation}>ADDITIONAL INFORMATION</div>
              <div className={styles.staticFormBox}>
                <Icon className={styles.iconWrapper} icon="EMAIL_ICON" />
                {email}
              </div>
              <AuthInputBox
                onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.NAME}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("name");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.NAME);
                }}
                onChangeFunc={this.handleNameChange}
                onBlurFunc={() => {
                  this.checkValidNameInput();
                  this.onBlurInput();
                }}
                placeHolder="Full Name"
                hasError={hasErrorCheck.name.hasError}
                inputType="string"
                iconName="FULL_NAME_ICON"
              />
              {this.getErrorMessage(hasErrorCheck.name)}
              <AuthInputBox
                onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.AFFILIATION}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("affiliation");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.AFFILIATION);
                }}
                onChangeFunc={this.handleAffiliationChange}
                onBlurFunc={() => {
                  this.checkValidAffiliationInput();
                  this.onBlurInput();
                }}
                placeHolder="Affiliation"
                hasError={hasErrorCheck.affiliation.hasError}
                inputType="string"
                iconName="AFFILIATION_ICON"
              />
              {this.getErrorMessage(hasErrorCheck.affiliation)}
              <div style={{ height: 63 }} />
              {this.getSubmitButton(isLoading)}
              <div className={styles.goBackButton}>GO BACK</div>
            </form>
          </div>
        );
      default:
        break;
    }
  }
}

export default connect(mapStateToProps)(SignUp);
