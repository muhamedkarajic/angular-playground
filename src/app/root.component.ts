import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { Result } from 'true-myth';
import { map$, switchMap$ } from './shared/helpers/true-myth.helper';
import { printError, printSavedUser, saveUser, UserError, validateUsernameHasValidChars, validateUsernameNotEmpty } from './shared/helpers/user.helper';
import { User } from './shared/models/user.model';

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {
  async ngOnInit() {
    const dorothyVaughan = new User('muhamedkarajic', 'Muhamed', 'Karajic');
    let date: Date = new Date();
    
    of(Result.ok<User, UserError>(dorothyVaughan)).pipe(
      switchMap$(validateUsernameNotEmpty),
      map$(validateUsernameHasValidChars),
      switchMap$(saveUser)
    ).subscribe(result => {
      result.match({
        Ok: userOrLoading => userOrLoading === 'LOADING' ? console.log('user is still loading..') : printSavedUser(userOrLoading),
        Err: error => printError(error),
      });
      console.log((new Date().getTime() - date.getTime()) * 0.001 + 'ms');
    });
  }
}
