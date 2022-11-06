import { Component, OnInit } from '@angular/core';
import { lastValueFrom, of, timer } from 'rxjs';
import { Result } from 'true-myth';
import { andThen, asyncAndThen } from './shared/helpers/true-myth.helper';
import { v4 } from 'uuid';

enum UserValidationError {
  USERNAME_EMPTY = 'Username cannot be empty!',
  USERNAME_INVALID_CHARS = 'Username must only contain alphanumeric chars and dashes/underscores'
}

const VALID_USERNAME_REGEX = /^[A-Za-z0-9_-]+$/;

enum UserSaveError {
  DB_SAVE_FAILED = "Failed saving user to the database!"
}

type UserError = UserValidationError | UserSaveError;

class User {
  constructor(
    readonly username: string,
    readonly firstName: string,
    readonly lastName: string,
  ) { }
}

class SavedUserAccount extends User {
  constructor(
    readonly id: string,
    override readonly username: string,
    override readonly firstName: string,
    override readonly lastName: string
  ) {
    super(username, firstName, lastName);
  }
}

@Component({
  selector: 'my-root',
  templateUrl: './root.component.html'
})
export class RootComponent implements OnInit {
  async ngOnInit() {
    const dorothyVaughan = new User('muhamedkarajic', 'Muhamed', 'Karajic');
    of(Result.ok<User, UserError>(dorothyVaughan))
      .pipe(
        asyncAndThen(this.validateUsernameNotEmpty),
        andThen(this.validateUsernameHasValidChars),
        asyncAndThen(this.saveUser),
      ).subscribe(result => {
        result.match({
          Ok: user => this.printSavedUser(user),
          Err: error => this.printError(error),
        });
      });
  }

  async saveUser(input: User): Promise<Result<SavedUserAccount, UserSaveError>> {
    // Let's pretend we made a call to our user database to save the user and
    //  this is the new user's user ID
    await lastValueFrom(timer(1000));
    if (Math.random() * 2 > 1 ? true : false)
      return Promise.resolve(Result.err(UserSaveError.DB_SAVE_FAILED))
    const savedUser = new SavedUserAccount(v4(), input.username, input.firstName, input.lastName);
    return Promise.resolve(Result.ok(savedUser));
  }

  async validateUsernameNotEmpty(input: User): Promise<Result<User, UserValidationError>> {
    await lastValueFrom(timer(1000));

    if (input.username.length === 0)
      return Result.err(UserValidationError.USERNAME_EMPTY);
    return Result.ok(input);
  }

  validateUsernameHasValidChars(input: User): Result<User, UserValidationError | UserError> {
    if (!input.username.match(VALID_USERNAME_REGEX))
      return Result.err(UserValidationError.USERNAME_INVALID_CHARS);
    return Result.ok(input);
  }

  printSavedUser(input: SavedUserAccount) {
    console.log('User is valid: ', input);
  }

  printError(error: UserError) {
    console.log('User is invalid: ', error);
  }
}
