import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ISignInState {
  isLoading: boolean;
  isFailed: boolean;
  hasError: boolean;
  email: string;
  password: string;
  emailErrorContent: string;
  passwordErrorContent: string;
}

export interface ISignInStateRecord
  extends TypedRecord<ISignInStateRecord>,
    ISignInState {}

const initialSignInState = {
  isLoading: false,
  isFailed: false,
  hasError: false,
  email: "",
  password: "",
  emailErrorContent: "",
  passwordErrorContent: ""
};

export const SignInStateFactory = makeTypedFactory<
  ISignInState,
  ISignInStateRecord
>(initialSignInState);

export const SIGN_IN_INITIAL_STATE = SignInStateFactory();
