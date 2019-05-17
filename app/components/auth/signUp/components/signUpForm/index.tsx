import * as React from "react";
import { Formik, Field, FormikErrors, Form } from "formik";
import { connect, Dispatch } from "react-redux";
import { withStyles } from "../../../../../helpers/withStylesHelper";
import { GLOBAL_DIALOG_TYPE } from "../../../../dialog/reducer";
import AuthTabs from "../../../authTabs";
import AuthInputBox from "../../../../common/inputBox/authInputBox";
import AuthButton from "../../../authButton";
import AffiliationBox from "../../../../authorCV/affiliationBox";
import validateEmail from "../../../../../helpers/validateEmail";
import { debouncedCheckDuplicate } from "../../helpers/checkDuplicateEmail";
const s = require("./style.scss");

interface SignUpFormProps {
  onClickNext: () => void;
  onClickTab: (type: GLOBAL_DIALOG_TYPE) => void;
  onSucceed: () => void;
  onClickBack: () => void;
  onSubmit: (values: SignUpFormValues) => Promise<void>;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dispatch: Dispatch<any>;
}

export interface SignUpFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
}

const validateForm = async (values: SignUpFormValues) => {
  const errors: FormikErrors<SignUpFormValues> = {};
  if (!validateEmail(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.password || (values.password && values.password.length < 8)) {
    errors.password = "Must have at least 8 characters!";
  }
  if (!values.firstName) {
    errors.firstName = "Please enter your first name";
  }
  if (!values.lastName) {
    errors.lastName = "Please enter your last name";
  }
  if (!values.affiliation) {
    errors.affiliation = "Please enter your affiliation";
  }

  const emailErr = await debouncedCheckDuplicate(values.email);
  if (emailErr) {
    errors.email = emailErr;
  }

  if (Object.keys(errors).length) {
    throw errors;
  }
};

const SignUpForm: React.FunctionComponent<SignUpFormProps> = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      await props.onSubmit(values);
      props.onSucceed();
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthTabs onClickTab={props.onClickTab} activeTab={"sign up"} />
      <div className={s.signUpContainer}>
        <Formik
          initialValues={{
            email: props.email,
            password: props.password,
            firstName: props.firstName,
            lastName: props.lastName,
            affiliation: "",
          }}
          onSubmit={handleSubmit}
          validate={validateForm}
          render={() => (
            <Form>
              <div className={s.additionalInformation}>ADDITIONAL INFORMATION</div>
              <div className={s.subHeader}>No abbreviation preferred</div>
              <Field name="email" type="email" component={AuthInputBox} placeholder="E-mail" iconName="EMAIL_ICON" />
              <Field
                name="password"
                type="password"
                component={AuthInputBox}
                placeholder="Password"
                iconName="PASSWORD_ICON"
              />
              <div className={s.nameItemWrapper}>
                <div className={s.nameItemSection}>
                  <Field
                    name="firstName"
                    type="text"
                    component={AuthInputBox}
                    placeholder="First Name"
                    iconName="FULL_NAME_ICON"
                  />
                </div>
                <div className={s.nameItemSection}>
                  <Field
                    name="lastName"
                    type="text"
                    component={AuthInputBox}
                    placeholder="Last Name"
                    iconName="FULL_NAME_ICON"
                  />
                </div>
              </div>
              <Field
                name="affiliation"
                placeholder="Affiliation / Company"
                type="text"
                component={AffiliationBox}
                inputBoxStyle={{ width: "100%" }}
                listWrapperStyle={{ top: "56px" }}
                inputStyle={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "flex-start",
                  alignItems: "center",
                  height: "47px",
                  borderRadius: "3px",
                  padding: "0 10px",
                  backgroundColor: "white",
                  border: "solid 1px $gray3",
                  overflow: "hidden",
                  marginTop: "10px",
                }}
              />
              <AuthButton
                type="submit"
                onClick={props.onClickNext}
                isLoading={isLoading}
                text="SIGN UP"
                style={{ backgroundColor: "#6096ff", marginTop: "10px", fontSize: "14px" }}
              />
            </Form>
          )}
        />
        <AuthButton
          isLoading={isLoading}
          type="button"
          onClick={props.onClickBack}
          style={{
            backgroundColor: "#e7eaef",
            fontSize: "14px",
            color: "#9aa3b5",
            marginTop: "10px",
            marginBottom: "12px",
          }}
          text="GO BACK"
        />
        <div className={s.signUpPrivacyPolicy}>
          {"By signing up, you agree with our "}
          <a href="https://scinapse.io/terms-of-service" target="_blank" rel="noopener nofollow noreferrer">
            Terms
          </a>
          {" & "}
          <a href="https://scinapse.io/privacy-policy" target="_blank" rel="noopener nofollow noreferrer">
            Privacy policy
          </a>.
        </div>
      </div>
    </>
  );
};

export default connect()(withStyles<typeof SignUpForm>(s)(SignUpForm));
