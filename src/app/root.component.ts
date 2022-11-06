import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { Result } from 'true-myth';
import { andThen, asyncAndThen } from './shared/helpers/true-myth.helper';
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
      asyncAndThen(validateUsernameNotEmpty),
      andThen(validateUsernameHasValidChars),
      asyncAndThen(saveUser)
    ).subscribe(result => {
      result.match({
        Ok: user => printSavedUser(user),
        Err: error => printError(error),
      });
      console.log((new Date().getTime() - date.getTime()) * 0.001 + 'ms');
    });
  }
}
