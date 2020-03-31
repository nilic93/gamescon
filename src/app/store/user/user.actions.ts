import {Action} from '@ngrx/store';

export const CHECK_LOGIN = 'CHECK_LOGIN';
export const HANDLE_ERROR = 'CHECK_LOGIN';
export const SET_USER = 'SET_USER';

export class CheckLogin implements Action {
  readonly type = CHECK_LOGIN;
}

export class HandleError implements Action {
  readonly type = HANDLE_ERROR;

  constructor(public payload: any) {
  }
}

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload: any) {
  }
}


export type UserActions =
  CheckLogin |
  HandleError |
  SetUser
  ;
