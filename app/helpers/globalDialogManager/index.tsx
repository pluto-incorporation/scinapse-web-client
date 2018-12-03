import StoreManager from "../../store";
import { ActionCreators } from "../../actions/actionTypes";
import { GLOBAL_DIALOG_TYPE } from "../../components/dialog/reducer";
import { Collection } from "../../model/collection";
import { Paper } from "../../model/paper";

class GlobalDialogManager {
  public openSignUpDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.SIGN_UP,
      })
    );
  }

  public openVerificationDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED,
      })
    );
  }

  public openResetPasswordDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.RESET_PASSWORD,
      })
    );
  }

  public openCitationDialog(targetPaperId: number) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.CITATION,
        citationDialogTargetPaperId: targetPaperId,
      })
    );
  }

  public openCollectionDialog(targetPaperId: number) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.COLLECTION,
        collectionDialogTargetPaperId: targetPaperId,
      })
    );
  }

  public openNewCollectionDialog() {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.NEW_COLLECTION,
      })
    );
  }

  public openEditCollectionDialog(collection: Collection) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.EDIT_COLLECTION,
        collection,
      })
    );
  }

  public openAuthorListDialog(paper: Paper) {
    StoreManager.store.dispatch(
      ActionCreators.openGlobalDialog({
        type: GLOBAL_DIALOG_TYPE.AUTHOR_LIST_DIALOG,
        authorListTargetPaper: paper,
      })
    );
  }
}

const globalDialogManager = new GlobalDialogManager();

export default globalDialogManager;
