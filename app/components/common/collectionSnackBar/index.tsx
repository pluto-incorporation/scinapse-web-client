import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Location } from 'history';
import Snackbar from '@material-ui/core/Snackbar';
import { AppState } from '../../../reducers';
import { closeCollectionSnackBar } from '../../../reducers/collectionSnackBar';
import { closeDialog } from '../../dialog/actions';
import Icon from '../../../icons';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
import { UserDevice } from '../../layouts/reducer';
import Button from '../button';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./collectionSnackBar.scss');

type Props = ReturnType<typeof mapStateToProps> & {
  location: Location;
};

const CollectionSnackBar: React.FC<Props> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const { collectionSnackBarState, location, layout } = props;
  const { collectionId, collectionName, isOpen } = collectionSnackBarState;
  const isLongName = collectionName.length >= 30 && layout.userDevice === UserDevice.MOBILE;

  useEffect(
    () => {
      dispatch(closeCollectionSnackBar());
    },
    [dispatch, location]
  );

  useEffect(
    () => {
      if (isOpen) {
        ActionTicketManager.trackTicket({
          pageType: getCurrentPageType(),
          actionType: 'view',
          actionArea: 'collectionSnackbar',
          actionTag: 'viewCollectionSnackBar',
          actionLabel: String(collectionId),
        });
      }
    },
    [isOpen, collectionId]
  );

  return (
    <Snackbar
      classes={{ root: s.snackbarWrapper }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={isOpen}
      onClose={() => dispatch(closeCollectionSnackBar())}
      autoHideDuration={5000}
      ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={
        <span id="message-id" className={s.snackbarContext}>
          {`Saved to `}
          {isLongName && <br />}
          <Link
            className={s.collectionName}
            to={`/collections/${collectionId}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'collectionSnackbar',
                actionTag: 'clickCollectionTitle',
                actionLabel: String(collectionId),
              });

              dispatch(closeCollectionSnackBar());
              dispatch(closeDialog());
            }}
          >{`${collectionName}.`}</Link>
        </span>
      }
      action={[
        <div className={s.viewCollectionBtn} key={`viewCollection`}>
          <Button
            elementType="link"
            variant="text"
            color="blue"
            size="large"
            to={`/collections/${collectionId}`}
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'collectionSnackbar',
                actionTag: 'clickViewCollection',
                actionLabel: String(collectionId),
              });

              dispatch(closeCollectionSnackBar());
              dispatch(closeDialog());
            }}
          >
            View Collection
          </Button>
        </div>,
        <div className={s.closeBtn} key={`close`}>
          <Button
            elementType="button"
            variant="text"
            color="gray"
            size="small"
            onClick={() => {
              ActionTicketManager.trackTicket({
                pageType: getCurrentPageType(),
                actionType: 'fire',
                actionArea: 'collectionSnackbar',
                actionTag: 'clickCloseButton',
                actionLabel: null,
              });

              dispatch(closeCollectionSnackBar());
            }}
          >
            <Icon icon="X_BUTTON" />
          </Button>
        </div>,
      ]}
    />
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    collectionSnackBarState: state.collectionSnackBarState,
    layout: state.layout,
  };
};

export default connect(mapStateToProps)(CollectionSnackBar);
