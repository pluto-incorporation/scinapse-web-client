import * as React from 'react';
import * as Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import * as classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@pluto_network/pluto-design-elements';
import { Formik, Form, Field, FormikErrors } from 'formik';
import PaperAPI from '../../api/paper';
import { AppState } from '../../reducers';
import validateEmail from '../../helpers/validateEmail';
import ActionTicketManager from '../../helpers/actionTicketManager';
import ScinapseFormikInput from '../common/scinapseInput/scinapseFormikInput';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { LAST_SUCCEEDED_EMAIL_KEY } from '../../constants/requestDialogConstant';
import { fetchLastFullTextRequestedDate } from '../../actions/paperShow';
import { closeRequestPaperDialog } from '../../reducers/requestPaperDialog';
import ReduxAutoSizeTextarea from '../common/autoSizeTextarea/reduxAutoSizeTextarea';
import Icon from '../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./requestPaperDialog.scss');

interface RequestPaperProps {
  paperId: string;
}

type FormState = ReturnType<typeof getInitialValues>;

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};
  if (!validateEmail(values.email)) {
    errors.email = 'Please enter valid e-mail address.';
    return errors;
  }

  Object.keys(values).forEach((formKey: keyof FormState) => {
    if (!values[formKey]) {
      errors[formKey] = 'Please fill the content';
    }
  });

  return errors;
}

function getInitialValues(email?: string) {
  return {
    email: email || '',
    whoami: '',
    important: '',
  };
}

function buildMessage(values: FormState) {
  return `Why important to me:<br />${
    values.important
  }<br /><br />Who am I (Adding your profile link is preferred):<br />${values.whoami}`.trim();
}

const RequestPaper: React.FunctionComponent<RequestPaperProps> = ({ paperId }) => {
  useStyles(s);
  const dispatch = useDispatch();
  const { currentUser, isOpen } = useSelector((appState: AppState) => ({
    currentUser: appState.currentUser,
    isOpen: appState.requestPaperDialogState.isOpen,
  }));
  const [isLoading, setIsLoading] = React.useState(false);

  function handleClose() {
    dispatch(closeRequestPaperDialog());
  }

  async function handleSubmitForm(values: FormState) {
    setIsLoading(true);

    const message = buildMessage(values);

    try {
      await PaperAPI.requestFullText({
        paperId: paperId,
        email: values.email,
        message,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
      });

      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'fire',
        actionArea: 'paperDescription',
        actionTag: 'sendRequestFullText',
        actionLabel: String(paperId),
      });

      Cookies.set(LAST_SUCCEEDED_EMAIL_KEY, values.email);

      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Sent request successfully.',
        },
      });
      dispatch(fetchLastFullTextRequestedDate(paperId));
      handleClose();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.detailTitle}>Request Paper</div>
      <div className={s.detailSubtitle}>
        This is not automated. We’re trying to contact authors when many requests are accepted.<br />
        The notification will be sent when paper is updated.
      </div>
      <Formik
        initialValues={getInitialValues(currentUser.email)}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        render={({ errors }) => (
          <Form className={s.form}>
            <div className={s.inputWrapper}>
              <label htmlFor="email" className={s.detailLabel}>
                Email*
              </label>
              <Field
                name="email"
                type="email"
                className={classNames({
                  [s.emailInput]: true,
                  [s.emailInputError]: !!errors.email,
                })}
                placeholder="ex) researcher@university.com"
                component={ScinapseFormikInput}
              />
            </div>
            <div style={{ marginTop: '24px' }} className={s.detailTitle}>
              Message to Authors
            </div>
            <div className={s.detailSubtitle}>Your message will play a key role to get a paper!</div>
            <div className={s.inputWrapper}>
              <label htmlFor="important" className={s.detailLabel}>
                Why important to me? *
              </label>
              <Field
                name="important"
                component={ReduxAutoSizeTextarea}
                textareaClassName={s.textAreaWrapper}
                textareaStyle={{ padding: '8px' }}
                rows={3}
                placeholder="ex) The interesting point is..."
              />
            </div>
            <div className={s.inputWrapper}>
              <label htmlFor="whoami" className={s.detailLabel}>
                Who am I? (Adding your profile link is preferred) *
              </label>
              <Field
                name="whoami"
                component={ReduxAutoSizeTextarea}
                textareaClassName={s.textAreaWrapper}
                textareaStyle={{ padding: '8px' }}
                rows={3}
                placeholder="Make them not wary... (Ex. Name, Research topic, Corresponding author, ...)"
              />
            </div>
            <div className={s.btnWrapper}>
              <Button
                elementType="button"
                aria-label="Cancel full text request button"
                size="medium"
                variant="text"
                color="blue"
                disabled={isLoading}
                onClick={handleClose}
                style={{ marginRight: '8px' }}
              >
                <span>Cancel</span>
              </Button>
              <Button
                elementType="button"
                aria-label="Send full text request button"
                type="submit"
                size="medium"
                variant="contained"
                color="blue"
                disabled={isLoading}
              >
                <Icon icon="SEND" />
                <span>Send</span>
              </Button>
            </div>
          </Form>
        )}
      />
    </Dialog>
  );
};

export default RequestPaper;
