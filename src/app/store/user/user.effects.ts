import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as userActions from './user.actions';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions) {
  }


  @Effect()
  public checkLogin$ = this.actions$
    .pipe(
      ofType(userActions.CHECK_LOGIN),
      mergeMap(async () => {
        console.log('aaaaa');
        return 'Hello ngrx';
      }),
      map(user => {
        return of(new userActions.SetUser(user));
      }),
      catchError(error => {
        return of(new userActions.HandleError(error));
      })
    );
}
