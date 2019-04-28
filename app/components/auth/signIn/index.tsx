import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Formik, Form, Field, FormikErrors } from "formik";
import { withRouter, RouteComponentProps } from "react-router-dom";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { withStyles } from "../../../helpers/withStylesHelper";
import AuthInputBox from "../../common/inputBox/authInputBox";
import { GLOBAL_DIALOG_TYPE, DialogState } from "../../dialog/reducer";
import AuthButton from "../authButton";
import GoogleAuthButton from "../authButton/googleAuthButton";
import ORSeparator from "../separator";
import AuthTabs from "../authTabs";
import AuthAPI from "../../../api/auth";
import { SignInResult } from "../../../api/types/auth";
import { getCollections } from "../../collections/actions";
import { closeDialog } from "../../dialog/actions";
import { signInWithEmail, signInWithSocial } from "./actions";
import validateEmail from "../../../helpers/validateEmail";
import AuthGuideContext from "../authGuideContext";
import { ActionCreators } from "../../../actions/actionTypes";
import { SIGN_UP_STEP } from "../signUp/types";
import { handleClickORCIDBtn } from "../signUp/actions";
import { AppState } from "../../../reducers";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import AuthContextText from "../authContextText";
import useFBIsLoading from "../../../hooks/FBisLoadingHook";
import { COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP } from "../../../constants/abTestGlobalValue";
import DialogCloseButton from "../authButton/dialogCloseButton";
const s = require("./signIn.scss");

declare var FB: any;

interface EmailFormValues {
  email: string;
  password: string;
}

interface SignInProps {
  handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
  dialogState: DialogState;
  dispatch: Dispatch<any>;
  userActionType: Scinapse.ActionTicket.ActionTagType | undefined;
  query?: string;
}

const oAuthBtnBaseStyle: React.CSSProperties = { position: "relative", fontSize: "13px", marginTop: "10px" };

const validateForm = (values: EmailFormValues) => {
  const errors: FormikErrors<EmailFormValues> = {};

  if (!validateEmail(values.email)) {
    errors.email = "E-Mail is invalid";
  }

  if (!values.password || values.password.length < 8) {
    errors.password = "Minimum length is 8";
  }

  return errors;
};

const SignIn: React.FunctionComponent<SignInProps & RouteComponentProps<any>> = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState("");
  const isDialog = !!props.handleChangeDialogType;
  const FBIsLoading = useFBIsLoading();

  function handleClickFBLogin() {
    FB.login(async (res: any) => {
      if (res.authResponse) {
        const accessToken = res.authResponse.accessToken;
        const status = await AuthAPI.checkOAuthStatus("FACEBOOK", accessToken);

        if (status.isConnected) {
          await props.dispatch(signInWithSocial("FACEBOOK", accessToken));
          const authContext = props.dialogState.authContext;
          if (authContext) {
            ActionTicketManager.trackTicket({
              pageType: authContext.pageType,
              actionType: "fire",
              actionArea: authContext.actionArea,
              actionTag: "signIn",
              actionLabel: authContext.actionLabel,
              expName: authContext.expName,
            });
          }
          props.dispatch(closeDialog());
        } else {
          props.dispatch(
            ActionCreators.changeGlobalDialog({
              type: GLOBAL_DIALOG_TYPE.SIGN_UP,
              signUpStep: SIGN_UP_STEP.WITH_SOCIAL,
              oauthResult: {
                email: status.email,
                firstName: status.firstName,
                lastName: status.lastName,
                token: accessToken,
                vendor: "FACEBOOK",
              },
            })
          );
        }
      }
    });
  }

  async function handleSubmit(formValues: EmailFormValues) {
    const { email, password } = formValues;

    try {
      setIsLoading(true);
      setNetworkError("");
      const res: SignInResult = await props.dispatch(signInWithEmail({ email, password }, isDialog));
      const authContext = props.dialogState.authContext;
      if (authContext) {
        ActionTicketManager.trackTicket({
          pageType: authContext.pageType,
          actionType: "fire",
          actionArea: authContext.actionArea,
          actionTag: "signIn",
          actionLabel: authContext.expName ? authContext.expName : authContext.actionLabel,
          expName: authContext.expName,
        });
      }
      if (res.member) {
        await props.dispatch(getCollections(res.member.id));
      }
      setIsLoading(false);

      if (isDialog) {
        props.dispatch(closeDialog());
      } else {
        props.history.push("/");
      }
    } catch (err) {
      setIsLoading(false);
      setNetworkError(err.message);
    }
  }

  return (
    <>
      <AuthContextText userActionType={props.userActionType} />
      <div className={s.authContainer}>
        <AuthGuideContext userActionType={props.userActionType} />
        <div className={s.authFormWrapper}>
          <AuthTabs onClickTab={props.handleChangeDialogType} activeTab="sign in" />
          <div className={s.formWrapper}>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validate={validateForm}
              validateOnChange={false}
              render={() => {
                return (
                  <Form>
                    <Field
                      name="email"
                      type="email"
                      component={AuthInputBox}
                      placeholder="E-mail"
                      iconName="EMAIL_ICON"
                    />
                    <Field
                      name="password"
                      type="password"
                      component={AuthInputBox}
                      placeholder="Password"
                      iconName="PASSWORD_ICON"
                    />
                    {networkError && <div className={s.errorContent}>{networkError}</div>}
                    <div
                      onClick={() => {
                        if (props.handleChangeDialogType) {
                          props.handleChangeDialogType(GLOBAL_DIALOG_TYPE.RESET_PASSWORD);
                        } else {
                          GlobalDialogManager.openResetPasswordDialog();
                        }
                      }}
                      className={s.forgotPasswordBox}
                    >
                      Forgot Password?
                    </div>
                    <AuthButton
                      type="submit"
                      isLoading={isLoading}
                      text="SIGN IN"
                      style={{ backgroundColor: "#6096ff", marginTop: "10px", fontSize: "14px" }}
                    />
                  </Form>
                );
              }}
            />
            <ORSeparator />
            <AuthButton
              isLoading={isLoading}
              text="CONTINUE WITH FACEBOOK"
              style={{ ...oAuthBtnBaseStyle, backgroundColor: "#3859ab", marginTop: "18px" }}
              iconName="FACEBOOK_LOGO"
              iconClassName={s.fbIconWrapper}
              onClick={handleClickFBLogin}
              disabled={FBIsLoading}
            />
            <GoogleAuthButton
              isLoading={isLoading}
              text="CONTINUE WITH GOOGLE"
              style={{ ...oAuthBtnBaseStyle, backgroundColor: "#dc5240" }}
              iconName="GOOGLE_LOGO"
              iconClassName={s.googleIconWrapper}
              onSignUpWithSocial={values => {
                props.dispatch(
                  ActionCreators.changeGlobalDialog({
                    type: GLOBAL_DIALOG_TYPE.SIGN_UP,
                    signUpStep: SIGN_UP_STEP.WITH_SOCIAL,
                    oauthResult: values,
                  })
                );
              }}
            />
            <AuthButton
              isLoading={isLoading}
              text="CONTINUE WITH ORCID"
              style={{ ...oAuthBtnBaseStyle, backgroundColor: "#a5d027" }}
              iconName="ORCID_LOGO"
              iconClassName={s.orcidIconWrapper}
              onClick={handleClickORCIDBtn}
            />
          </div>
          {COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP === "closeIconBottom" ? (
            <div className={s.dialogCloseBtnWrapper}>
              <DialogCloseButton />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof SignIn>(s)(SignIn)));
